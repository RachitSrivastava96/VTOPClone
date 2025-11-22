from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import logout

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
    # For now, a simple dashboard page for logged-in users
    return render(request, 'core/dashboard.html', {'user': request.user})


def logout_view(request):
    logout(request)
    return redirect('login')


@csrf_exempt
def force_logout(request):
    if request.method == "POST":
        if request.user.is_authenticated:
            logout(request)
        return HttpResponse("OK")
    return HttpResponse("Invalid request", status=400)