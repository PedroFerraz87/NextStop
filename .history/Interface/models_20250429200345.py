from django.db import models
from django.contrib.auth.models import User

class Interface(models.Model):
    nome = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    senha = models.CharField(max_length=128)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="interface")

    def __str__(self):
        return self.nome

class Roteiro(models.Model):
    destino = models.CharField(max_length=100)
    data_ida = models.DateField()
    data_volta = models.DateField()
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='roteiros')
    custo_total = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)  

    def __str__(self):
        return f"Roteiro para {self.destino}" if self.destino else "Roteiro sem destino"

class Programacao(models.Model):
    roteiro = models.ForeignKey(Roteiro, related_name='programacoes', on_delete=models.CASCADE)
    dia = models.DateField()
    horario = models.TimeField()
    local = models.CharField(max_length=255)

    def __str__(self):
        if self.local and self.dia and self.horario:
            return f"{self.local} em {self.dia.strftime('%d/%m/%Y')} às {self.horario.strftime('%H:%M')}"
        return "Programação incompleta"
    
class Lembrete(models.Model):
    titulo = models.CharField(max_length=255)
    data = models.DateField()
    descricao = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="lembretes")  

class ChecklistItem(models.Model):
    nome = models.CharField(max_length=255)
    concluido = models.BooleanField(default=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="checklist_items") 

    def __str__(self):
        return self.nome


    def __str__(self):
        return self.titulo

class DestinoFavorito(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)  
    nome_destino = models.CharField(max_length=255)
    data_adicionado = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nome_destino
