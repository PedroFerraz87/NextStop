from django.db import models

class Interface(models.Model):
    nome=models.CharField(max_length=50)
    email=models.EmailField(unique=True)
    senha=models.CharField(max_length=8)

    def __str__(self):
        return self.nome
    
