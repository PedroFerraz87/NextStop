from django.shortcuts import redirect, render, get_object_or_404
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth.hashers import check_password
from django.contrib.auth.hashers import make_password
from django.views.decorators.csrf import csrf_exempt
from django.urls import reverse
from .models import DestinoFavorito
from .models import Interface as InterfaceModel
from .models import Roteiro, Programacao
from .models import ChecklistItem
from .models import DestinoFavorito
from django.contrib.auth.models import User
from django.db import transaction
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.http import HttpResponse
from django.http import JsonResponse
from django.utils.timezone import is_naive, make_aware, localtime
from datetime import datetime, time, timedelta
from django.utils.dateparse import parse_date, parse_time

@login_required
def home(request):
     if request.user.is_authenticated:
        try:
            interface = InterfaceModel.objects.get(user=request.user)
            return render(request, 'Interface/home.html', {'usuario': interface})
        except InterfaceModel.DoesNotExist:
            return redirect('login')
     else:
        return redirect('login')

def login(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        senha = request.POST.get('password')

        print("[DEBUG] Tentando autenticar:", email)

        try:
            interface = InterfaceModel.objects.get(email=email)
            user = interface.user

            user_auth = authenticate(request, username=user.username, password=senha)

            if user_auth is not None:
                print("[DEBUG] Autenticação bem sucedida")
                auth_login(request, user_auth)
                return redirect('home')
            else:
                print("[DEBUG] Falha na autenticação")
                return render(request, 'Interface/login.html', {'erro': 'Usuário e/ou senha inválidos'})

        except InterfaceModel.DoesNotExist:
            print("[DEBUG] InterfaceModel não encontrado")
            return render(request, 'Interface/login.html', {'erro': 'Usuário e/ou senha inválidos'})

    return render(request, 'Interface/login.html')

@login_required
def logout_view(request):
    auth_logout(request)
    return redirect('login')
    
@transaction.atomic
def cadastro(request):
     if request.method == 'POST':
        nome = request.POST.get('nome')
        email = request.POST.get('email')
        senha = request.POST.get('senha')

        print(f"[DEBUG] nome: {nome}, email: {email}, senha: {senha}")

        try:
            if InterfaceModel.objects.filter(email=email).exists():
                print("[DEBUG] Email já existe!")
                return render(request, 'Interface/cadastro.html', {'erro': 'Email já cadastrado.'})

            user = User.objects.create_user(username=email, email=email, password=senha)

            interface = InterfaceModel.objects.create(
                nome=nome,
                email=email,
                user=user 
            )

            print("[DEBUG] Usuário criado:", interface)
            return redirect('login')

        except Exception as e:
            print("[ERRO] Falha ao salvar no banco:", e)
            return render(request, 'Interface/cadastro.html', {'erro': 'Erro ao salvar usuário.'})

     return render(request, 'Interface/cadastro.html')

@login_required
def roteiro(request):
    if request.method == 'POST':
        destino = request.POST.get('destino')
        data_ida = request.POST.get('dataIda')
        data_volta = request.POST.get('dataVolta')
        dias = request.POST.getlist('dias[]')
        horarios = request.POST.getlist('horarios[]')
        locais = request.POST.getlist('locais[]')

        if not destino or not data_ida or not data_volta:
            messages.error(request, 'Preencha todos os campos obrigatórios.')
            return redirect('roteiro')

        if not dias or not horarios or not locais:
            messages.error(request, 'Adicione pelo menos uma programação.')
            return redirect('roteiro')

        roteiro = Roteiro.objects.create(
            destino=destino,
            data_ida=data_ida,
            data_volta=data_volta,
            user=request.user
        )

        horarios_ocupados = set()

        for dia, horario, local in zip(dias, horarios, locais):
            if dia and horario and local:
                dia_obj = parse_date(dia)
                horario_obj = parse_time(horario)

                if Programacao.objects.filter(roteiro=roteiro, dia=dia_obj, horario=horario_obj).exists():
                    messages.error(request, f'Horário {horario} em {dia} já está preenchido.')
                    roteiro.delete()  
                    return redirect('roteiro')

                Programacao.objects.create(
                    roteiro=roteiro,
                    dia=dia_obj,
                    horario=horario_obj,
                    local=local
                )

        messages.success(request, 'Roteiro criado com sucesso!')
        print(f"[DEBUG] Roteiro criado: {roteiro}")
        return redirect('gerenciar')

    return render(request, 'Interface/roteiro.html')


@login_required
def gerenciar_viagens(request):
    roteiros_queryset = Roteiro.objects.filter(user=request.user).prefetch_related('programacoes')
    
    roteiros = []

    for roteiro in roteiros_queryset:
        roteiros.append({
            'viagem': roteiro,
            'programacoes': roteiro.programacoes.all()
        })

    context = {
        'roteiros': roteiros
    }
    return render(request, 'Interface/gerenciar.html', context)

@login_required
def editar_roteiro(request, roteiro_id):
    roteiro = get_object_or_404(Roteiro, id=roteiro_id, user=request.user)  

    if request.method == 'POST':
        destino = request.POST.get('destino')
        data_ida = request.POST.get('dataIda')
        data_volta = request.POST.get('dataVolta')
        dias = request.POST.getlist('dias[]')
        horarios = request.POST.getlist('horarios[]')
        locais = request.POST.getlist('locais[]')

        if not destino or not data_ida or not data_volta:
            messages.error(request, 'Preencha todos os campos obrigatórios.')
            return redirect(reverse('editar', args=[roteiro_id]))

        if not dias or not horarios or not locais:
            messages.error(request, 'Adicione pelo menos uma programação.')
            return redirect(reverse('editar', args=[roteiro_id]))

        combinacoes = set()
        for dia, horario in zip(dias, horarios):
            dia_obj = parse_date(dia)
            horario_obj = parse_time(horario)
            chave = (dia_obj, horario_obj)

            if chave in combinacoes:
                messages.error(request, f'Horário duplicado: {horario} em {dia}.')
                return redirect(reverse('editar', args=[roteiro_id]))
            combinacoes.add(chave)

        roteiro.destino = destino
        roteiro.data_ida = data_ida
        roteiro.data_volta = data_volta
        roteiro.save()

        roteiro.programacoes.all().delete()

        for dia, horario, local in zip(dias, horarios, locais):
            if dia and horario and local:
                dia_obj = parse_date(dia)
                horario_obj = parse_time(horario)
                Programacao.objects.create(
                    roteiro=roteiro,
                    dia=dia_obj,
                    horario=horario_obj,
                    local=local
                )

        messages.success(request, 'Roteiro atualizado com sucesso!')
        return redirect('gerenciar')

    programacoes = roteiro.programacoes.all()

    context = {
        'roteiro': roteiro,
        'programacoes': programacoes,
    }
    return render(request, 'Interface/editar.html', context)

@login_required
def excluir_roteiro(request, roteiro_id):

    roteiro = get_object_or_404(Roteiro, id=roteiro_id, user=request.user)

    if request.method == 'POST': 
        roteiro.delete()  
        messages.success(request, 'Roteiro excluído com sucesso!')  
        return redirect('gerenciar') 

    return redirect('gerenciar') 

@login_required
def excluir_programacao(request, programacao_id):
    programacao = get_object_or_404(Programacao, id=programacao_id, roteiro__user=request.user)
    roteiro_id = programacao.roteiro.id
    programacao.delete()
    return redirect('editar', roteiro_id)

def orcamento(request):
    if request.method == "POST":
        roteiro_id = request.POST.get('roteiro') 
        roteiro = Roteiro.objects.get(id=roteiro_id, user=request.user)

        hospedagem = float(request.POST.get('hospedagem', 0) or 0)
        passagem = float(request.POST.get('passagem', 0) or 0)
        alimentacao = float(request.POST.get('alimentacao', 0) or 0)
        passeios = float(request.POST.get('passeios', 0) or 0)
        extras = float(request.POST.get('extras', 0) or 0)

        total_orcamento = hospedagem + passagem + alimentacao + passeios + extras

        roteiro.custo_total = total_orcamento
        roteiro.save()

        return redirect('ver_orcamentos')
    else:
        roteiros = Roteiro.objects.filter(user=request.user)
        return render(request, 'orcamento.html', {'roteiros': roteiros})

@login_required
def ver_orcamentos(request):
    roteiros = Roteiro.objects.filter(user=request.user).exclude(custo_total=0).order_by('-id')
    return render(request, 'ver_orcamentos.html', {'roteiros': roteiros})

@login_required
def checklist(request):
    if request.method == "POST":
        novo_item = request.POST.get('item')
        if novo_item:
            ChecklistItem.objects.create(nome=novo_item, concluido=False, user=request.user)
            
            return redirect('checklist')

    pendentes = ChecklistItem.objects.filter(concluido=False, user=request.user)
    concluidos = ChecklistItem.objects.filter(concluido=True, user=request.user)
    return render(request, 'Interface/checklist.html', {'pendentes': pendentes, 'concluidos': concluidos})

@login_required
def marcar_concluido(request, item_id):
    item = get_object_or_404(ChecklistItem, id=item_id)
    item.concluido = not item.concluido
    item.save()
    return redirect('checklist')


@login_required
def sugestao(request):
    favoritos = DestinoFavorito.objects.filter(user=request.user)
    nomes_favoritos = [fav.nome_destino for fav in favoritos]  
    return render(request, 'Interface/sugestão.html', {
        'favoritos': favoritos,
        'nomes_favoritos': nomes_favoritos 
    })

@login_required
def adicionar_favorito(request):
    if request.method == "POST":
        nome_destino = request.POST.get("nome_destino")

        if not DestinoFavorito.objects.filter(user=request.user, nome_destino=nome_destino).exists():
            DestinoFavorito.objects.create(user=request.user, nome_destino=nome_destino)

    return HttpResponse(status=200)

@login_required
def listar_favoritos(request):
    favoritos = DestinoFavorito.objects.filter(user=request.user)
    return render(request, "Interface/sugestão.html", {"favoritos": favoritos})

@login_required
def desfavoritar_destino(request):
    if request.method == "POST":
        nome_destino = request.POST.get("nome_destino")

        destino = DestinoFavorito.objects.filter(user=request.user, nome_destino=nome_destino).first()
        if destino:
            destino.delete()
            return JsonResponse({"status": "ok", "mensagem": "Destino removido com sucesso!"})
        return JsonResponse({"status": "erro", "mensagem": "Destino não encontrado."})
    
    return JsonResponse({"status": "erro", "mensagem": "Método não permitido."})

from django.utils.timezone import localtime

@login_required
def lembretes_view(request):
    programacoes = Programacao.objects.select_related('roteiro').all()
    lembretes_json = []

    agora = localtime()

    for p in programacoes:
        evento_datetime = p.get_evento_datetime()
        diff = (evento_datetime - agora).total_seconds() / 60 - 
        if (0 <= diff <= 10):
            lembretes_json.append({
                'titulo': p.local,
                'evento_iso': evento_datetime.isoformat(),
            })

    return render(request, 'Interface/lembretes.html', {
        'lembretes_json': lembretes_json,
    })
