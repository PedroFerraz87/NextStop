from django.contrib import messages
from hht==
from django.shortcuts import redirect, render
from django.contrib.auth.decorators import login_required
from django.db import transaction
from django.contrib.auth.hashers import check_password
from django.contrib.auth.hashers import make_password
from .models import Interface as InterfaceModel
from .models import Programacao, Roteiro
from .models import Lembrete
from .models import ChecklistItem
from .models import DestinoFavorito


def login_required(view_func):
    def wrapper(request, *args, **kwargs):
        if not request.session.get('usuario_id'):
            return redirect('login')
        return view_func(request, *args, **kwargs)
    return wrapper  

@login_required
def home(request):
    usuario_id = request.session.get('usuario_id')
    if not usuario_id:
        return redirect('login')
    
    try:
        usuario = InterfaceModel.objects.get(id=usuario_id)
    except InterfaceModel.DoesNotExist:
        return redirect('login')

    return render(request, 'Interface/home.html', {'usuario': usuario})

def login(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        senha = request.POST.get('password')

        try:
            usuario = InterfaceModel.objects.get(email=email)
            if check_password(senha, usuario.senha):
                request.session['usuario_id'] = usuario.id  
                return redirect('home')
            else:
                return render(request, 'Interface/login.html', {'erro': 'Usuário e/ou senha inválidos'})
        except InterfaceModel.DoesNotExist:
            return render(request, 'Interface/login.html', {'erro': 'Usuário e/ou senha inválidos'})
        
    return render(request, 'Interface/login.html')

@login_required
def logout_view(request):
    request.session.flush() 
    return redirect('login')

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

            senha_hash = make_password(senha)
            usuario = InterfaceModel.objects.create(nome=nome, email=email, senha=senha_hash)
            print("[DEBUG] Usuário criado:", usuario)
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
            messages.error(request, 'Preencha todos os campos principais.')
            return redirect('roteiro')

        if not locais or any(not d or not h or not l for d, h, l in zip(dias, horarios, locais)):
            messages.error(request, 'Todos os campos de programação devem ser preenchidos.')
            return redirect('roteiro')

        try:
            with transaction.atomic():
                novo_roteiro = Roteiro.objects.create(
                    destino=destino,
                    data_ida=data_ida,
                    data_volta=data_volta
                )
                for dia, horario, local in zip(dias, horarios, locais):
                    Programacao.objects.create(
                        roteiro=novo_roteiro,
                        dia=dia,
                        horario=horario,
                        local=local
                    )
            messages.success(request, 'Roteiro salvo com sucesso!')
            return redirect('home')
        except Exception as e:
            messages.error(request, f'Erro ao salvar: {str(e)}')

    return render(request, 'Interface/roteiro.html')

@login_required
def orçamento(request):
    return render(request, 'Interface/orçamento.html')

@login_required
def checklist(request):
    if request.method == 'POST':
        nome_item = request.POST.get('item')
        if nome_item:
            ChecklistItem.objects.create(nome=nome_item, feito=False)
        return redirect('checklist')

    pendentes = ChecklistItem.objects.filter(feito=False)
    concluidos = ChecklistItem.objects.filter(feito=True)

    return render(request, 'checklist.html', {
        'pendentes': pendentes,
        'concluidos': concluidos,
    })

@login_required
def lembretes_view(request):
    lembretes = Lembrete.objects.all().order_by('data')
    return render(request, 'Interface/lembretes.html')

@login_required
def sugestão(request):
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
    return render(request, "suggestao.html", {"favoritos": favoritos})










