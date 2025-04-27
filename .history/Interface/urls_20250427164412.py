from django.urls import path
from . import views
from .views import logout_view


urlpatterns = [
    path('', views.login, name='login'),
    path('home/', views.home, name='home'),
    path('cadastro/', views.cadastro, name='cadastro'),
    path('logout/', views.logout_view, name='logout'),
    path('roteiro/', views.roteiro, name='roteiro'),
    path('orçamento/', views.orçamento, name='orçamento'),
    path('sugestão/', views.sugestão, name='sugestão'),
    path('checklist/', views.checklist, name='checklist'),
    path('lembretes/', views.lembretes_view, name='lembretes'),
    path('adicionar_favorito/', views.adicionar_favorito, name='adicionar_favorito'),
    path('favoritos/', views.listar_favoritos, name='listar_favoritos'),
    path('gerenciar/', views.gerenciar_viagens, name='gerenciar_viagens'),
    path('editar/<int:roteiro_id>/', views.editar_viagem, name='editar_viagem'),
    path('deletar/<int:roteiro_id>/', views.deletar_viagem, name='deletar_viagem'),
]


