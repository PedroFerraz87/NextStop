from django.db import models
from django.db import models
from django.contrib.auth.models import User


class Interface(models.Model):
    nome=models.CharField(max_length=100)
    email=models.EmailField(unique=True)
    senha=models.CharField(max_length=128)

    def __str__(self):
        return self.nome
    
class Roteiro(models.Model):
    destino = models.CharField(max_length=100)
    data_ida = models.DateField()
    data_volta = models.DateField()

    def __str__(self):
        return self.destino

class Programacao(models.Model):
    roteiro = models.ForeignKey(Roteiro, related_name='programacoes', on_delete=models.CASCADE)
    dia = models.DateField()
    horario = models.TimeField()
    local = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.local} em {self.dia} às {self.horario}"
    
    from django.db import models

class ChecklistItem(models.Model):
    nome = models.CharField(max_length=255)
    feito = models.BooleanField(default=False)

    def __str__(self):
        return self.nome
    
    from django.db import models

class Lembrete(models.Model):
    titulo = models.CharField(max_length=255)
    data = models.DateField()
    descricao = models.TextField()

    def __str__(self):
        return self.titulo
    
class Favorito(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    nome_destino = models.CharField(max_length=255)
    descricao_destino = models.TextField()
    imagem_destino = models.URLField()

    class Meta:
        unique_together = ('user', 'nome_destino') 

    def __str__(self):
        return f'{self.user.username} favoritou {self.nome_destino}'





