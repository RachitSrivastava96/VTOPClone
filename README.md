# VTOPClone

## Overview

VTOPClone is a Django-powered recreation of the VIT Online Portal (VTOP). It centralizes academic utilities—identity management, class utilities, task tracking, and service shortcuts—into a glassmorphism-inspired dashboard that feels modern while emulating the original workflow students expect.

The project mixes Django views/REST-like endpoints with vanilla JavaScript widgets (sidebar, to-do list, dark mode, expandable cards) so the experience remains lightweight yet interactive without external frameworks.

## Comprehensive Feature Breakdown

### Authentication & Session Flow
- **Secure Login/Logout**: Uses Django’s authentication backend, CSRF protection on all forms, and the default password hashing pipeline.
- **Session Hardening**: Sessions expire after 20 minutes of inactivity, are saved per request, and are invalidated when the browser session ends—mirroring VTOP’s security posture.
- **Access Control**: Every student-facing view (`dashboard`, `profile`, `id_card`, `credentials`, to-do APIs) checks for authenticated users before rendering data.

### Landing Experience
- **Marketing-style Landing Page** (`index`): Animated hero cards highlight primary portal actions; gradients and blur effects come from `style.css`.
- **Responsive Header**: Fixed translucent navbar keeps navigation accessible on scroll, ensuring the mobile menu button remains visible.

### Sidebar & Navigation System
- **Collapsible Sidebar** (`sidebar.js`): Tap/click toggles the sliding drawer plus an overlay layer for focus on small screens.
- **Categorized Dropdowns**: Every service cluster (My Info, Info Corner, Academics, Research, Examination, Services, Bonafide, Online Payments, Hostels, My Account) expands via accordion animation defined in CSS.
- **Custom Icons & Bullets**: CSS pseudo-elements generate uniform bullet markers for sub-links, ensuring a clean, accessible navigation tree.
- **Logout Shortcut**: Persistent CTA at the bottom keeps sign-out one click away.

### Dashboard Widgets
- **Personalized Greeting**: Uses `{{ user.username }}` to render a welcome banner plus motivational subtitle.
- **Live Clock** (`dashboard.js`): Updates every second to mimic VTOP’s real-time status indicators.
- **Dark Mode Toggle** (`darkmode.js`): Stores user preference in `localStorage`, switching CSS variables for muted palettes during night study sessions.
- **Quick Link Pills**: Static cards (Courses, Exams, Grades, Payments) help new users spot the core modules instantly.
- **Spotlight Feed**: Highlight block for institutional notices (academic calendar, forms, exam reminders).
- **Expandable Course List**: `Current Semester Courses` card collapses/expands; arrow indicator rotates via CSS transitions.
- **CGPA Snapshot**: Placeholder card ready to ingest live GPA/credit data once backend services are wired.
- **To-Do / Reminder Widget**:
  - `todo.js` fetches tasks, renders list items, and binds add/toggle/delete events.
  - Inline input/button pairing lets students track ad-hoc academic chores.

### Identity & Profile Utilities
- **Profile Page** (`profile_view`): Presents stored user metadata with layout parity to VTOP’s official profile worksheets.
- **Digital ID Card** (`id_card`): Rendered as a printable badge referencing student identity/photo placeholders.
- **Credential Wallet** (`credentials_view`):
  - WiFi username/password auto-generated per account (`StudentCredentials` model).
  - Library ID follows the `LIB#####` format.
  - Shows creation timestamps for auditability.

### Academic & Service Shortcuts
Each sidebar dropdown intentionally mirrors the real portal taxonomy. Even if some links are placeholders, they map to expected workflows:
- **My Info**: Profile, ID card, credentials, acknowledgement, banking, AAPAR upload.
- **Info Corner**: FAQ, spotlight announcements, general notices.
- **Proctor**: Advisor contact info and meeting history.
- **Academics**: Faculty info, class messaging, curriculum, timetable, attendance, course page, QCM, academic calendar.
- **Research**: Research profile, SEM request, coursework registration/status, meetings, attendance, leave, letters, thesis submission, document uploads.
- **Examination**: Schedules (general/online/offline), marks/grades, review requests, history, arrears, re-exam apps.
- **Services**: Transcript requests, program migration, late-hour approvals, final-year registration.
- **Bonafide**: Certificate request entry point.
- **Online Payments**: Payment portal, receipts, fee intimations.
- **Hostels**: Leave requests, biometric logs, room allotment.
- **My Account**: Password change controls.

Even when a link currently routes to `#`, it preserves the UX skeleton for full feature parity later on.

### To-Do API Suite
- `get_todos`: Returns JSON list scoped to the current user.
- `add_todo`: Validates body text, persists a new `ToDo` record, and returns the created entity.
- `toggle_todo`: Flips completion status via AJAX call.
- `delete_todo`: Removes a task record.

These lightweight endpoints keep the dashboard responsive without requiring a SPA framework.

### StudentCredentials Automation
- Post-save signals or creation logic ensure every new `User` triggers a paired `StudentCredentials` entry.
- WiFi password generator creates 12-character alphanumerics, keeping credentials unique per user.
- Values surface in the dashboard and Credential page with masked password display capabilities if desired later.

### Frontend Implementation Details
- **CSS**: `core/static/core/css/style.css` defines glass panels, animated gradients, scroll bars, and responsive spacing.
- **JavaScript Modules**:
  - `sidebar.js`: Handles slide-in/out, dropdown toggles, overlay state.
  - `darkmode.js`: Listens for toggle clicks, swaps CSS classes, stores preferences.
  - `dashboard.js`: Controls live clock, expandable cards, and ties into the to-do widget.
  - `todo.js`: Implements fetch/POST/DELETE interactions plus DOM manipulation.

### Accessibility & UX Touches
- Keyboard focus states preserved via CSS transitions.
- Pseudo-elements supply bullet markers so screen readers treat them as list items.
- Animations are kept under 0.3s to avoid motion sickness while adding polish.

## Technologies/Tools Used

- **Backend**: Django 5.2.8
- **Database**: SQLite3 (swap-friendly with PostgreSQL or MySQL)
- **Frontend**: HTML, CSS, Vanilla JavaScript
- **Authentication**: Django’s built-in auth & messaging frameworks
- **Task Runner**: `manage.py` for migrations, shell, and dev server

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
├── requirements.txt         # Python dependencies for the project
├── Statement.md             # Problem description / project statement
└── README.md                # Project documentation
```

## Key Components

### Models

- **ToDo**: Task text, completion flag, timestamps, and FK to the owner. Drives the dashboard reminder widget.
- **StudentCredentials**: WiFi username/password, Library ID, and creation metadata. Auto-instantiated whenever a `User` is created so onboarding is frictionless.

### Views

- `index`: Landing page hero with CTA cards.
- `login_page`: Handles GET form rendering and POST authentication.
- `dashboard`: Aggregates widgets, sidebar, and JS bundles for authenticated users.
- `profile_view`: Renders student metadata.
- `id_card`: Builds the printable ID layout.
- `credentials_view`: Shows WiFi/library credentials from `StudentCredentials`.
- `get_todos`, `add_todo`, `toggle_todo`, `delete_todo`: JSON endpoints powering the to-do widget.

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
  - 20-minute inactivity timeout for safety.
  - Browser-close invalidation.
  - `SESSION_SAVE_EVERY_REQUEST = True` to ensure sliding expiration.
- **CSRF Protection**: Django's built-in CSRF protection
- **Authentication Required**: Django decorators/logic guard every sensitive view.
- **Secure Defaults**: Relies on Django password hashing, `X-Frame-Options`, and other middleware defaults.

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