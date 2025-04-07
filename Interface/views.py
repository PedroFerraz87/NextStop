from django.contrib import messages
from django.http import HttpResponse
from django.shortcuts import redirect, render
from .models import Roteiro

def home(request):
    return render(request, 'Interface/home.html')

def cadastro(request):
    return render(request, 'Interface/cadastro.html')

def login(request):
    return render(request, 'Interface/login.html')

def roteiro(request):
    return render(request, 'Interface/roteiro.html')

def orçamento(request):
    return render(request, 'Interface/orçamento.html')

def sugestão(request):
    return render(request, 'Interface/sugestão.html')



