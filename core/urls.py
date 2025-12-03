from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('login/', views.login_page, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path("api/todos/", views.get_todos, name="get_todos"),
    path("api/todos/add/", views.add_todo, name="add_todo"),
    path("api/todos/toggle/<int:todo_id>/", views.toggle_todo, name="toggle_todo"),
    path("api/todos/delete/<int:todo_id>/", views.delete_todo, name="delete_todo"),
    path("profile/", views.profile_view, name="profile"),
    path("id-card/", views.id_card, name="id_card"),
    path("credentials/", views.credentials_view, name="credentials"),
]
