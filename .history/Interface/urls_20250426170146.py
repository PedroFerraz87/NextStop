from django.urls import path
from . import views
from .views import logout_view


urlpatterns = [
    path('', views.login_view, name='login'),
    path('home/', views.home, name='home'),
    path('cadastro/', views.cadastro, name='cadastro'),
    path('logout/', logout_view, name='logout'),
    path('roteiro/', views.roteiro, name='roteiro'),
    path('orçamento/', views.orçamento, name='orçamento'),
    path('sugestão/', views.sugestão, name='sugestão'),
    path('', views.checklist_view, name='checklist'),
    path('marcar/<int:item_id>/', views.marcar_concluido, name='marcar_concluido'),
    from django.urls import path
from . import views

urlpatterns = [
    path('', views.lembretes_view, name='lembretes'),
]

]


