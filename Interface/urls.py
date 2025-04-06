from django.urls import path
from django.contrib.auth.views import LoginView
from . import views

urlpatterns = [
    path('home/', LoginView.as_view(template_name='static/home.html'), name='home'),
    path('login/', LoginView.as_view(template_name='static/login.html'), name='login'),
    path('cadastrar/', views.cadastrar, name='cadastrar'),
]