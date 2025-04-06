from django.http import HttpResponse
from django.shortcuts import redirect, render

def home(request):
    return redirect('home')

def login(request):
    return redirect('login')

def cadastrar(request):
    return render(request, 'static/cadastrar.html')

