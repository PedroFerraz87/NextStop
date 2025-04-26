from django.db import models

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
    
from django.db import models
from django.contrib.auth.models import User

class Destino(models.Model):
    nome = models.CharField(max_length=255)
        descricao = models.TextField()

        def __str__(self):
            return self.nome

class DestinoFavorito(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    destino = models.ForeignKey(Destino, on_delete=models.CASCADE)
    data_adicionado = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('usuario', 'destino')  

    def __str__(self):
        return f'{self.usuario.username} favoritou {self.destino.nome}'




