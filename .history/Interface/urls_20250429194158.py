from django.urls import path
from . import views
from .views import login, logout_view, cadastro

urlpatterns = [
    path('', views.login, name='login'),
    path('home/', views.home, name='home'),
    path('cadastro/', views.cadastro, name='cadastro'),
    path('logout/', views.logout_view, name='logout'),
    path('roteiro/', views.roteiro, name='roteiro'),
    path('gerenciar/', views.gerenciar_viagens, name='gerenciar'),
    path('editar/<int:roteiro_id>/', views.editar_roteiro, name='editar'),
    path('excluir/<int:roteiro_id>/', views.excluir_roteiro, name='excluir_roteiro'),
    path('programacao/excluir/<int:programacao_id>/', views.excluir_programacao, name='excluir_programacao'),
    path('orcamento/', views.orcamento, name='orcamento'),
    path('ver_orcamentos/', views.ver_orcamentos, name='ver_orcamentos'),
    path('checklist/', views.checklist, name='checklist'),
    path('checklist/marcar_concluido/<int:item_id>/', views.marcar_concluido, name='marcar_concluido'),
    path('sugestao/', views.sugestao, name='sugestao'),
    path('adicionar_favorito/', views.adicionar_favorito, name='adicionar_favorito'),
    path('favoritos/', views.listar_favoritos, name='listar_favoritos'),
    path('lembretes/', views.lembretes_view, name='lembretes'),
    path("desfavoritar/", views.desfavoritar_destino, name="desfavoritar_destino"),
]


    