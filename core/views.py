from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import ToDo, StudentCredentials, extract_branch_from_username
import json


# ==================== PUBLIC VIEWS ====================

def index(request):
    """Home page - shows login options"""
    return render(request, 'core/index.html')


def login_page(request):
    """Login page - handles authentication"""
    # Redirect to dashboard if already logged in
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


def logout_view(request):
    """Logout - silent redirect to login page"""
    request.session.flush()
    logout(request)
    response = redirect('login')
    response.delete_cookie('tab_id')
    return response


# ==================== AUTHENTICATED VIEWS ====================

@login_required(login_url='login')
def dashboard(request):
    """Main dashboard page"""
    return render(request, 'core/dashboard.html', {'user': request.user})


@login_required
def profile_view(request):
    """User profile page"""
    return render(request, "core/profile.html")


@login_required
def id_card(request):
    """Student ID card page"""
    creds, _ = StudentCredentials.objects.get_or_create(user=request.user)
    
    if not creds.branch_name:
        code, name = extract_branch_from_username(request.user.username)
        if name:
            creds.branch_code = code
            creds.branch_name = name
            creds.save()
    
    return render(request, "core/id_card.html", {
        "user": request.user,
        "creds": creds,
    })


@login_required
def credentials_view(request):
    """Student credentials page"""
    creds, _ = StudentCredentials.objects.get_or_create(user=request.user)
    
    if not creds.branch_name:
        code, name = extract_branch_from_username(request.user.username)
        if name:
            creds.branch_code = code
            creds.branch_name = name
            creds.save()
    
    return render(request, "core/credentials.html", {"creds": creds})


# ==================== TODO API ENDPOINTS ====================

@csrf_exempt
@login_required
def get_todos(request):
    """Get all todos for current user"""
    todos = ToDo.objects.filter(user=request.user).values("id", "text", "is_done")
    return JsonResponse(list(todos), safe=False)


@csrf_exempt
@login_required
def add_todo(request):
    """Add new todo"""
    if request.method != 'POST':
        return JsonResponse({"error": "Method not allowed"}, status=405)
    
    try:
        data = json.loads(request.body)
        task_text = data.get("text", "").strip()

        if not task_text:
            return JsonResponse({"error": "Task cannot be empty"}, status=400)
        
        todo = ToDo.objects.create(user=request.user, text=task_text)
        
        return JsonResponse({
            "id": todo.id,
            "text": todo.text,
            "is_done": todo.is_done
        })
    
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
@login_required
def toggle_todo(request, todo_id):
    """Toggle todo completion status"""
    if request.method != 'POST':
        return JsonResponse({"error": "Method not allowed"}, status=405)
    
    try:
        todo = ToDo.objects.get(id=todo_id, user=request.user)
        todo.is_done = not todo.is_done
        todo.save()
        
        return JsonResponse({
            "status": "updated",
            "is_done": todo.is_done
        })
    
    except ToDo.DoesNotExist:
        return JsonResponse({"error": "Todo not found"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
@login_required
def delete_todo(request, todo_id):
    """Delete todo"""
    if request.method != 'POST':
        return JsonResponse({"error": "Method not allowed"}, status=405)
    
    try:
        deleted = ToDo.objects.filter(id=todo_id, user=request.user).delete()[0]
        
        if deleted == 0:
            return JsonResponse({"error": "Todo not found"}, status=404)
        
        return JsonResponse({"status": "deleted"})
    
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)