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
    # urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('adicionar_favorito/', views.adicionar_favorito, name='adicionar_favorito'),
    path('favoritos/', views.listar_favoritos, name='listar_favoritos'),
]

]


