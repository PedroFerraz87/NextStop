from django.urls import path
from . import views
from .views import logout_view


urlpatterns = [
    path('', views.login_view, name='login'),
    path('home/', views.home, name='home'),
    path('cadastro/', views.cadastro, name='cadastro'),
    path('logout/', logout, name='logout'),
    path('roteiro/', views.roteiro, name='roteiro'),
    path('orçamento/', views.orçamento, name='orçamento'),
    path('sugestão/', views.sugestão, name='sugestão'),
    path('checklist/', views.checklist, name='checklist'),
    path('checklist/marcar/<int:item_id>/', views.marcar_concluido, name='marcar_concluido'),
    path('lembretes/', views.lembretes_view, name='lembretes'),
]


