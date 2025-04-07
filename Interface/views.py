from django.contrib import messages
from django.http import HttpResponse
from django.shortcuts import redirect, render
from .models import Roteiro

def home(request):
    return render(request, 'home.html')

def cadastro(request):
    return render(request, 'cadastro.html')

def login(request):
    return render(request, 'login.html')

def roteiro(request):
    return render(request, 'roteiro.html')

def orçamento(request):
    return render(request, 'orçamento.html')

def sugestão(request):
    return render(request, 'sugestão.html')



