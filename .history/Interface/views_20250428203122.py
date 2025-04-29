from django.shortcuts import redirect, render, get_object_or_404
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth.hashers import check_password
from django.contrib.auth.hashers import make_password
from django.views.decorators.csrf import csrf_exempt
from django.urls import reverse
from .models import Interface as InterfaceModel
from .models import Roteiro, Programacao
from .models import Lembrete
from .models import ChecklistItem
from .models import DestinoFavorito
from django.contrib.auth.models import User
from django.db import transaction
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.urls import reverse

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
            return redirect('Interface/roteiro')

        if not dias or not horarios or not locais:
            messages.error(request, 'Adicione pelo menos uma programação.')
            return redirect('Interface/roteiro.html')

        roteiro = Roteiro.objects.create(
            destino=destino,
            data_ida=data_ida,
            data_volta=data_volta
        )
        for dia, horario, local in zip(dias, horarios, locais):
            if dia and horario and local:
                Programacao.objects.create(
                    roteiro=roteiro,
                    dia=dia,
                    horario=horario,
                    local=local
                )

        messages.success(request, 'Roteiro criado com sucesso!')
        print(f"[DEBUG] Roteiro criado: {roteiro}")
        return redirect('home') 

    return render(request, 'Interface/roteiro.html')

@login_required
def gerenciar_viagens(request):
    viagens = []

    roteiros = Roteiro.objects.prefetch_related('programacoes').all()

    for roteiro in roteiros:
        for programacao in roteiro.programacoes.all():
            viagens.append({
                'id': roteiro.id, 
                'destino': roteiro.destino,
                'data_ida': roteiro.data_ida,
                'data_volta': roteiro.data_volta,
                'horario': programacao.horario,
                'lugar': programacao.local,
            })
    context = {
        'viagens': viagens
    }
    return render(request, 'Interface/gerenciar.html', context)


@login_required
def editar_roteiro(request, roteiro_id):
    roteiro = get_object_or_404(Roteiro, id=roteiro_id)

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

        roteiro.destino = destino
        roteiro.data_ida = data_ida
        roteiro.data_volta = data_volta
        roteiro.save()

        roteiro.programacoes.all().delete()

        for dia, horario, local in zip(dias, horarios, locais):
            if dia and horario and local:
                Programacao.objects.create(
                    roteiro=roteiro,
                    dia=dia,
                    horario=horario,
                    local=local
                )

        messages.success(request, 'Roteiro atualizado com sucesso!')
        return redirect('home')

    programacoes = roteiro.programacoes.all()

    context = {
        'roteiro': roteiro,
        'programacoes': programacoes,
    }
    return render(request, 'Interface/editar.html', context)


def excluir_roteiro(request, roteiro_id):
    roteiro = get_object_or_404(Roteiro, id=roteiro_id)

    if request.method == 'POST':
        roteiro.delete()
        messages.success(request, 'Roteiro excluído com sucesso!')
        return redirect('Interface/gerenciar.html')

    return render(request, 'home')

@login_required
def orcamento(request):
    return render(request, 'Interface/orçamento.html')

@login_required
def checklist(request):
    if request.method == "POST":
        novo_item = request.POST.get('item')
        if novo_item:
            ChecklistItem.objects.create(nome=novo_item, concluido=False, usuario=request.user.interface)
            return redirect('checklist')

    pendentes = ChecklistItem.objects.filter(concluido=False)
    concluidos = ChecklistItem.objects.filter(concluido=True)
    return render(request, 'Interface/checklist.html', {'pendentes': pendentes, 'concluidos': concluidos})

@login_required
def marcar_concluido(request, item_id):
    item = get_object_or_404(ChecklistItem, id=item_id)
    item.concluido = not item.concluido
    item.save()
    return redirect('checklist')

@login_required
def lembretes_view(request):
    lembretes = Lembrete.objects.all().order_by('data')
    return render(request, 'Interface/lembretes.html')

@login_required
def sugestao(request):
    return render(request, 'Interface/sugestão.html')

@login_required
def adicionar_favorito(request):
    if request.method == "POST":
        nome_destino = request.POST.get("nome_destino")

        if not DestinoFavorito.objects.filter(user=request.user, nome_destino=nome_destino).exists():
            DestinoFavorito.objects.create(user=request.user, nome_destino=nome_destino)

    return redirect("Interface/sugestão.html") 

@login_required
def listar_favoritos(request):
    favoritos = DestinoFavorito.objects.filter(user=request.user)
    return render(request, "Interface/sugestão.html", {"favoritos": favoritos})
