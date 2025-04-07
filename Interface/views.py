from django.contrib import messages
from django.http import HttpResponse
from django.shortcuts import redirect, render
from .models import Interface as InterfaceModel
from django.contrib.auth import authenticate, login

def home(request):
    return render(request, 'Interface/home.html')

def login_view(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        senha = request.POST.get('senha')

        try:
            usuario = InterfaceModel.nome.get(email=email, senha=senha)
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
        
        usuario = InterfaceModel.objects.create(nome=nome, email=email, senha=senha)
        usuario.save()

        return redirect('login')
    
    return render(request, 'Interface/cadastro.html')

def roteiro(request):
    return render(request, 'Interface/roteiro.html')

def orçamento(request):
    return render(request, 'Interface/orçamento.html')

def sugestão(request):
    return render(request, 'Interface/sugestão.html')





