from django.contrib import messages
from django.http import HttpResponse
from django.shortcuts import redirect, render
from .models import Interface
from django.contrib.auth import authenticate,login

def home(request):
    return render(request, 'Interface/home.html')

def login(request):
    if request.method == 'POST':
        email = request.POST['email']
        senha = request.POST['senha']

        try:
            Interface = Interface.objects.get(email=email, senha=senha)
            login(request, Interface)  
            return redirect('home')  
        except Interface.DoesNotExist:
            return render(request, 'Interface/login.html', {'erro': 'Dados inválidos'})
    
    return render(request, 'Interface/login.html')

def cadastro(request):
    if request.method == 'POST':
        nome = request.POST['nome']
        email = request.POST['email']
        senha = request.POST['senha']
        
        Interface = Interface.objects.create(nome=nome, email=email, senha=senha)
        Interface.save()

        return redirect('login')
    
    return render(request, 'Interface/cadastro.html')

def roteiro(request):
    return render(request, 'Interface/roteiro.html')

def orçamento(request):
    return render(request, 'Interface/orçamento.html')

def sugestão(request):
    return render(request, 'Interface/sugestão.html')





