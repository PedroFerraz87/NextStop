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
        return f"{self.destino} ({self.data_ida} - {self.data_volta})"

class Programacao(models.Model):
    roteiro = models.ForeignKey(Roteiro, on_delete=models.CASCADE, related_name='programacoes')
    dia = models.DateField()
    horario = models.TimeField()
    local = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.local} em {self.dia} às {self.horario}"
