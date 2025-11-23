from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.http import JsonResponse
from .models import ToDo
from django.views.decorators.csrf import csrf_exempt
import json
def index(request):
    return render(request, 'core/index.html')

def login_page(request):
    if request.user.is_authenticated:
        return redirect('dashboard')

    if request.method == 'POST':
        username = request.POST.get('username', '').strip()
        password = request.POST.get('password', '')

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('dashboard')
        else:
            messages.error(request, "Invalid username or password.")

    return render(request, 'core/login.html')


@login_required(login_url='login')
def dashboard(request):
    return render(request, 'core/dashboard.html', {'user': request.user})

@login_required(login_url='login')
def get_todos(request):
    todos = ToDo.objects.filter(user=request.user).values("id", "text", "is_done")
    return JsonResponse(list(todos), safe=False)

def logout_view(request):
    logout(request)
    return redirect('login')

@login_required
def profile_view(request):
    return render(request, "core/profile.html")

@login_required
def id_card(request):
    return render(request, "core/id_card.html", {
        "user": request.user
    })
    
    
@csrf_exempt
def force_logout(request):
    if request.method == "POST":
        if request.user.is_authenticated:
            logout(request)
        return HttpResponse("OK")
    return HttpResponse("Invalid request", status=400) 

@csrf_exempt
@login_required
def add_todo(request):
    data = json.loads(request.body)
    task_text = data.get("text", "").strip()

    if task_text:
        todo = ToDo.objects.create(user=request.user, text=task_text)
        return JsonResponse({"id": todo.id, "text": todo.text, "is_done": todo.is_done})

    return JsonResponse({"error": "Invalid task"}, status=400)


@csrf_exempt
@login_required
def toggle_todo(request, todo_id):
    todo = ToDo.objects.get(id=todo_id, user=request.user)
    todo.is_done = not todo.is_done
    todo.save()
    return JsonResponse({"status": "updated", "is_done": todo.is_done})


@csrf_exempt
@login_required
def delete_todo(request, todo_id):
    ToDo.objects.filter(id=todo_id, user=request.user).delete()
    return JsonResponse({"status": "deleted"})