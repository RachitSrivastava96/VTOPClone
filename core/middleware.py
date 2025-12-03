"""
Custom middleware for strict single-session management
One session per browser - simple and reliable
Timeout handled by Django's SESSION_COOKIE_AGE setting
"""
from django.contrib.auth import logout
from django.shortcuts import redirect
from django.utils.deprecation import MiddlewareMixin
import uuid


class SingleSessionMiddleware(MiddlewareMixin):
    """
    Enforces one active session per browser.
    - Opening new tab with same URL = logout (sessionStorage is tab-specific)
    - Closing browser = session ends
    - One user per browser at a time
    - Timeout handled by SESSION_COOKIE_AGE in settings.py
    """
    
    def process_request(self, request):
        # Skip middleware for login, logout, static files, and API calls
        exempt_paths = ['/login/', '/logout/', '/static/', '/api/']
        if any(request.path.startswith(p) for p in exempt_paths):
            return None

        # Only check authenticated users
        if not request.user.is_authenticated:
            return None

        # Get session ID from server session
        session_id = request.session.get('tab_session_id')
        
        # Get session ID from client (JavaScript sends this)
        client_session_id = request.GET.get('_sid') or request.POST.get('_sid')
        
        # First time login - create new session ID
        if not session_id:
            new_session_id = str(uuid.uuid4())
            request.session['tab_session_id'] = new_session_id
            request.session['is_new_login'] = True
            return None
        
        # Client doesn't have session ID or it doesn't match = new tab
        if not client_session_id or client_session_id != session_id:
            # New tab detected - logout silently
            logout(request)
            request.session.flush()
            return redirect('/login/')
        
        # Valid session - continue
        request.session['is_new_login'] = False
        return None
    
    def process_response(self, request, response):
        # Add JavaScript session validator to authenticated pages
        if hasattr(request, 'user') and request.user.is_authenticated:
            session_id = request.session.get('tab_session_id')
            is_new = request.session.get('is_new_login', False)
            
            if session_id and hasattr(response, 'content') and b'<body' in response.content:
                # Inject JavaScript to handle session validation
                script = f'''
                <script>
                (function() {{
                    const SID_KEY = 'vtop_sid';
                    const stored = sessionStorage.getItem(SID_KEY);
                    const server = '{session_id}';
                    const isNew = {str(is_new).lower()};
                    
                    if (isNew) {{
                        // New login - save session ID
                        sessionStorage.setItem(SID_KEY, server);
                    }} else if (!stored) {{
                        // No stored ID = new tab without proper login
                        window.location.href = '/logout/';
                        return;
                    }} else if (stored !== server) {{
                        // Mismatched session = logout
                        window.location.href = '/logout/';
                        return;
                    }}
                    
                    // Attach session ID to all requests
                    
                    // 1. Form submissions
                    document.addEventListener('submit', function(e) {{
                        const form = e.target;
                        if (!form.querySelector('input[name="_sid"]')) {{
                            const inp = document.createElement('input');
                            inp.type = 'hidden';
                            inp.name = '_sid';
                            inp.value = server;
                            form.appendChild(inp);
                        }}
                    }}, true);
                    
                    // 2. AJAX/Fetch requests
                    const _fetch = window.fetch;
                    window.fetch = function(...args) {{
                        if (args[0] && typeof args[0] === 'string') {{
                            const u = new URL(args[0], location.origin);
                            u.searchParams.set('_sid', server);
                            args[0] = u.toString();
                        }}
                        return _fetch.apply(this, args);
                    }};
                    
                    // 3. Navigation links
                    document.addEventListener('click', function(e) {{
                        if (e.target.tagName === 'A' && e.target.href) {{
                            const u = new URL(e.target.href);
                            if (u.origin === location.origin && 
                                !u.pathname.startsWith('/static/') &&
                                !u.pathname.startsWith('/login/') &&
                                !u.pathname.startsWith('/logout/')) {{
                                u.searchParams.set('_sid', server);
                                e.target.href = u.toString();
                            }}
                        }}
                    }}, true);
                }})();
                </script>
                </body>
                '''.encode('utf-8')
                
                response.content = response.content.replace(b'</body>', script)
        
        return response