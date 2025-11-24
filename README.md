# Project Title

## VTOPClone

## Overview

A Django-based web application that replicates the core functionality of VIT Online Portal (VTOP), providing students with an intuitive interface to manage their academic information, credentials, and tasks.

## Features

- **User Authentication**: Secure login and logout functionality with session management
- **Student Dashboard**: Centralized hub for accessing all student services
- **To-Do List**: Personal task management system with add, toggle, and delete capabilities
- **Student Credentials**: Management of WiFi credentials and Library ID
- **Profile Page**: View and manage student profile information
- **ID Card**: Digital ID card display
- **Session Management**: Automatic session timeout after 20 minutes of inactivity

## Technologies/Tools Used

- **Backend**: Django 5.2.8
- **Database**: SQLite3
- **Frontend**: HTML, CSS, JavaScript
- **Authentication**: Django's built-in authentication system

## Steps to Install & Run the Project

## Prerequisites

Before you begin, ensure you have the following installed:

- Python 3.8 or higher
- pip (Python package manager)
- Virtual environment (recommended)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd VTOPClone
   ```

2. **Create a virtual environment** (recommended)
   ```bash
   python -m venv venv
   ```

3. **Activate the virtual environment**
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

4. **Install Django**
   ```bash
   pip install django
   ```

   Or install from requirements.txt if available:
   ```bash
   pip install -r requirements.txt
   ```

5. **Run database migrations**
   ```bash
   python manage.py migrate
   ```

6. **Create a superuser** (optional, for admin access)
   ```bash
   python manage.py createsuperuser
   ```

## Running the Application

1. **Start the development server**
   ```bash
   python manage.py runserver
   ```

2. **Access the application**
   - Open your web browser and navigate to: `http://127.0.0.1:8000/`
   - Or `http://localhost:8000/`

3. **Access the admin panel** (if superuser created)
   - Navigate to: `http://127.0.0.1:8000/admin/`

## Project Structure

```
VTOPClone/
│
├── core/                      # Main Django application
│   ├── migrations/           # Database migrations
│   ├── static/               # Static files (CSS, JS, images)
│   │   └── core/
│   │       ├── css/
│   │       ├── js/
│   │       └── images/
│   ├── templates/            # HTML templates
│   │   └── core/
│   ├── admin.py             # Admin configuration
│   ├── models.py            # Database models
│   ├── views.py             # View functions
│   ├── urls.py              # URL routing
│   └── tests.py             # Unit tests
│
├── vtopclone/                # Django project settings
│   ├── settings.py          # Project settings
│   ├── urls.py              # Root URL configuration
│   ├── wsgi.py              # WSGI configuration
│   └── asgi.py              # ASGI configuration
│
├── db.sqlite3               # SQLite database
├── manage.py                # Django management script
└── README.md                # Project documentation
```

## Key Components

### Models

- **ToDo**: Stores user tasks with text, completion status, and timestamps
- **StudentCredentials**: Manages student WiFi credentials and Library ID (auto-generated on user creation)

### Views

- `index`: Landing page
- `login_page`: User authentication
- `dashboard`: Main student dashboard
- `profile_view`: Student profile page
- `id_card`: Digital ID card display
- `credentials_view`: View WiFi and Library credentials
- `get_todos`, `add_todo`, `toggle_todo`, `delete_todo`: To-do list API endpoints

### URLs

- `/` - Home page
- `/login/` - Login page
- `/logout/` - Logout
- `/dashboard/` - Student dashboard
- `/profile/` - Student profile
- `/id-card/` - ID card view
- `/credentials/` - Credentials management
- `/api/todos/` - To-do list API endpoints
- `/admin/` - Django admin panel

## Security Features

- **Session Management**: 
  - Sessions expire after 20 minutes of inactivity
  - Sessions close when browser is closed
  - Session saved on every request
- **CSRF Protection**: Django's built-in CSRF protection
- **Authentication Required**: Protected routes require user login

## Customization

### Creating a New User

You can create users through:
1. Django admin panel (`/admin/`)
2. Django shell:
   ```bash
   python manage.py shell
   ```
   ```python
   from django.contrib.auth.models import User
   user = User.objects.create_user('username', 'email@example.com', 'password')
   ```

When a new user is created, a `StudentCredentials` object is automatically generated with:
- WiFi username (same as Django username)
- Random WiFi password (12 characters)
- Auto-generated Library ID (format: LIB#####)

## Instructions for Testing

Run the test suite:
```bash
python manage.py test
```

## Database

The project uses SQLite3 by default. To reset the database:

```bash
rm db.sqlite3
python manage.py migrate
```

## Database Migrations

Create new migrations after model changes:
```bash
python manage.py makemigrations
python manage.py migrate
```

## Deployment

For production deployment:

1. Set `DEBUG = False` in `settings.py`
2. Update `ALLOWED_HOSTS` with your domain
3. Change `SECRET_KEY` to a secure random value
4. Use a production database (PostgreSQL recommended)
5. Configure static files serving
6. Set up proper security headers

## Support

For issues and questions, please open an issue in the repository.

or Contact : rachitsrivastava0fficial96@gmail.com

**Note**: This is a clone/replication project for educational purposes. Ensure compliance with your institution's policies when using or deploying this application.