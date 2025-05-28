from django.db import models
from django.contrib.auth.models import User
from datetime import datetime, timedelta
from django.utils.timezone import make_aware, is_naive, now

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

    hospedagem = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    passagem = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    alimentacao = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    passeios = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    extras = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    custo_total = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    def calcular_custo_total(self):
        self.custo_total = (
            self.hospedagem +
            self.passagem +
            self.alimentacao +
            self.passeios +
            self.extras
        )
        return self.custo_total

    def save(self, *args, **kwargs):
        self.calcular_custo_total()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Roteiro para {self.destino}" if self.destino else "Roteiro sem destino"


class Programacao(models.Model):
    roteiro = models.ForeignKey(Roteiro, related_name='programacoes', on_delete=models.CASCADE)
    dia = models.DateField()
    horario = models.TimeField()
    local = models.CharField(max_length=255)

    class Meta:
        unique_together = ('roteiro', 'dia', 'horario')

    def __str__(self):
        if self.local and self.dia and self.horario:
            return f"{self.local} em {self.dia.strftime('%d/%m/%Y')} às {self.horario.strftime('%H:%M')}"
        return "Programação incompleta"

    def get_evento_datetime(self):
        evento = datetime.combine(self.dia, self.horario)
        return make_aware(evento) if is_naive(evento) else evento

    def lembrete_1h(self):
        return now() >= self.get_evento_datetime() - timedelta(hours=1)

    def lembrete_10min(self):
        return now() >= self.get_evento_datetime() - timedelta(minutes=10)


class ChecklistItem(models.Model):
    nome = models.CharField(max_length=255)
    concluido = models.BooleanField(default=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="checklist_items") 

    def __str__(self):
        return self.nome

class DestinoFavorito(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)  
    nome_destino = models.CharField(max_length=255)
    data_adicionado = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nome_destino
