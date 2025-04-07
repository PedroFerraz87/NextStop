from django.db import models
from django.contrib.auth.models import User

class Usuario(models.Model):
    nome = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    senha = models.CharField(max_length=100)

    def __str__(self):
        return self.nome

class Roteiro(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)    
    locais = models.TextField(default='Local padrão')
    horario = models.TimeField()

    def __str__(self):
        return f"{self.locais} às {self.horario}"
