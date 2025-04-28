from django.urls import path
from . import views
from .views import logout_view

urlpatterns = [
    path('', views.login, name='login'),
    path('home/', views.home, name='home'),
    path('cadastro/', views.cadastro, name='cadastro'),
    path('logout/', views.logout_view, name='logout'),
    path('orçamento/', views.orçamento, name='orçamento'),
    path('sugestão/', views.sugestão, name='sugestão'),
    path('adicionar_favorito/', views.adicionar_favorito, name='adicionar_favorito'),
    path('checklist/', views.checklist, name='checklist'),
    path('checklist/marcar_concluido/<int:item_id>/', views.marcar_concluido, name='marcar_concluido'),
    path('lembretes/', views.lembretes_view, name='lembretes'),
    path('favoritos/', views.listar_favoritos, name='listar_favoritos'),
    path('roteiro/', views.roteiro, name='roteiro'),
    path('gerenciar/', views.gerenciar_viagens, name='gerenciar'),
    path('editar/<int:roteiro_id>/', views.editar_roteiro, name='editar'),
    path('excluir/<int:roteiro_id>/', views.excluir_roteiro, name='excluir_roteiro'),
]


    