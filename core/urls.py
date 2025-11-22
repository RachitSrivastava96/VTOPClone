from django.urls import path
from . import views
from .views import force_logout

urlpatterns = [
    path('', views.index, name='index'),
    path('login/', views.login_page, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('force-logout/', force_logout, name='force_logout'),
]
