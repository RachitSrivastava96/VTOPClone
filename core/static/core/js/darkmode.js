document.addEventListener("DOMContentLoaded", function() {
  const body = document.body;

  // Always keep public pages dark and ignore stored preference
  if (body.classList.contains("login-page") || body.classList.contains("landing-page")) {
    body.classList.add("dark");
    return;
  }

  if (localStorage.getItem("darkMode") === "true") {
    body.classList.add("dark");
  }
});