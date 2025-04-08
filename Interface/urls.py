from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('cadastro/', views.cadastro, name='cadastro'),
    path('login/', views.login_view, name='login'),
    path('roteiro/', views.roteiro, name='roteiro'),
    path('orçamento/', views.orçamento, name='orçamento'),
    path('sugestão/', views.sugestão, name='sugestão'),
]
