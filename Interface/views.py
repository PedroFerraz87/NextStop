from django.contrib import messages
from django.http import HttpResponse
from django.shortcuts import redirect, render
from .models import Interface as InterfaceModel
from django.contrib.auth import authenticate, login
from .models import Roteiro, Programacao
from django.db import transaction

def home(request):
    return render(request, 'Interface/home.html')

def login_view(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        senha = request.POST.get('senha')

        try:
            usuario = InterfaceModel.objects.get(email=email, senha=senha)
           # login(request, Interface)  
            return redirect('home')  
        except InterfaceModel.DoesNotExist:
            return render(request, 'Interface/login.html', {'erro': 'Não encontrado'})
    
    return render(request, 'Interface/login.html')

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

            usuario = InterfaceModel.objects.create(nome=nome, email=email, senha=senha)
            print("[DEBUG] Usuário criado:", usuario)
            return redirect('login')
        except Exception as e:
            print("[ERRO] Falha ao salvar no banco:", e)
            return render(request, 'Interface/cadastro.html', {'erro': 'Erro ao salvar usuário.'})

    return render(request, 'Interface/cadastro.html')
   
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
                roteiro = roteiro.objects.create(
                    destino=destino,
                    data_ida=data_ida,
                    data_volta=data_volta
                )
                for dia, horario, local in zip(dias, horarios, locais):
                    Programacao.objects.create(
                        roteiro=roteiro,
                        dia=dia,
                        horario=horario,
                        local=local
                    )
            messages.success(request, 'Roteiro salvo com sucesso!')
            return redirect('home')
        except Exception as e:
            messages.error(request, f'Erro ao salvar: {str(e)}')

    return render(request, 'Interface/roteiro.html')

def orçamento(request):
    return render(request, 'Interface/orçamento.html')

def sugestão(request):
    return render(request, 'Interface/sugestão.html')




