function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");
  const toggle = document.getElementById("sidebarToggle");
  const isOpen = sidebar.classList.toggle("open");
  overlay.classList.toggle("show");
  if (isOpen) {
    toggle.classList.add("hidden");
  } else {
    toggle.classList.remove("hidden");
  }
}

function toggleDropdown(id) {
  const clickedHeader = event.currentTarget;
  const clickedArrow = clickedHeader.querySelector(".dropdown-arrow");
  const content = document.getElementById(id);
  const allContents = document.querySelectorAll(".dropdown-content");
  const allArrows = document.querySelectorAll(".dropdown-arrow");
  allContents.forEach(function(c) {
    if (c !== content) {
      c.classList.remove("open");
    }
  });
  allArrows.forEach(function(a) {
    if (a !== clickedArrow) {
      a.style.transform = "rotate(0deg)";
    }
  });
  const isOpen = content.classList.toggle("open");
  clickedArrow.style.transform = isOpen ? "rotate(90deg)" : "rotate(0deg)";
}