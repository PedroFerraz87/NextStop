from django.http import HttpResponse
from django.shortcuts import render

def home(request):
    return render(request, 'static/home.html')

def login(request):
    return render(request, 'static/login.html')

def cadastrar(request):
    return render(request, 'static/cadastrar.html')

