from django.urls import path
from . import views
from .views import force_logout

urlpatterns = [
    path('', views.index, name='index'),
    path('login/', views.login_page, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('force-logout/', force_logout, name='force_logout'),
    path("api/todos/", views.get_todos, name="get_todos"),
    path("api/todos/add/", views.add_todo, name="add_todo"),
    path("api/todos/toggle/<int:todo_id>/", views.toggle_todo, name="toggle_todo"),
    path("api/todos/delete/<int:todo_id>/", views.delete_todo, name="delete_todo"),
]
