document.addEventListener("DOMContentLoaded", function () {
  const todoList = document.getElementById("todo-list");
  const todoInput = document.getElementById("todo-input");
  const todoAddBtn = document.getElementById("todo-add");
  if (!todoList || !todoInput || !todoAddBtn) return;
  let tasks = [];

  function loadTasks() {
    fetch("/api/todos/")
      .then(function (res) {
        if (!res.ok) throw new Error("Failed to fetch tasks");
        return res.json();
      })
      .then(function (fetchedTasks) {
        tasks = fetchedTasks;
        tasks.forEach(function (task) {
          addTaskToUI(task, true);
        });
        refreshTaskCount();
      })
      .catch(function (err) {
        console.error("Error loading tasks:", err);
        showNotification("Failed to load tasks", "error");
      });
  }
  loadTasks();

  function addTask() {
    const text = todoInput.value.trim();
    if (!text) {
      todoInput.style.animation = "shake 0.3s ease";
      setTimeout(function () {
        todoInput.style.animation = "";
      }, 300);
      return;
    }
    todoAddBtn.disabled = true;
    todoAddBtn.textContent = "Adding...";
    fetch("/api/todos/add/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken"),
      },
      body: JSON.stringify({ text: text }),
    })
      .then(function (res) {
        if (!res.ok) throw new Error("Failed to add task");
        return res.json();
      })
      .then(function (task) {
        tasks.push(task);
        addTaskToUI(task);
        todoInput.value = "";
        refreshTaskCount();
        showNotification("Task added successfully! ✓", "success");
      })
      .catch(function (err) {
        console.error("Error adding task:", err);
        showNotification("Failed to add task", "error");
      })
      .finally(function () {
        todoAddBtn.disabled = false;
        todoAddBtn.textContent = "Add";
      });
  }

  todoAddBtn.addEventListener("click", addTask);
  todoInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      addTask();
    }
  });

  function addTaskToUI(task, skipAnimation) {
    if (document.querySelector('[data-id="' + task.id + '"]')) return;
    const li = document.createElement("li");
    li.dataset.id = task.id;
    li.classList.add("todo-item");
    const taskText = document.createElement("span");
    taskText.className = task.is_done ? "todo-text done" : "todo-text";
    taskText.textContent = task.text;
    const toggleBtn = document.createElement("button");
    toggleBtn.className = "todo-toggle";
    toggleBtn.innerHTML = "✓";
    toggleBtn.title = "Toggle completion";
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "todo-delete";
    deleteBtn.innerHTML = "✗";
    deleteBtn.title = "Delete task";
    li.appendChild(taskText);
    li.appendChild(toggleBtn);
    li.appendChild(deleteBtn);
    if (!skipAnimation) {
      li.style.opacity = "0";
      li.style.transform = "translateY(20px)";
      setTimeout(function () {
        li.style.transition = "all 0.4s ease";
        li.style.opacity = "1";
        li.style.transform = "translateY(0)";
      }, 10);
    }
    toggleBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      toggleBtn.disabled = true;
      fetch("/api/todos/toggle/" + task.id + "/", {
        method: "POST",
        headers: {
          "X-CSRFToken": getCookie("csrftoken"),
        },
      })
        .then(function (res) {
          if (!res.ok) throw new Error("Failed to toggle task");
          return res.json();
        })
        .then(function () {
          taskText.classList.toggle("done");
          task.is_done = !task.is_done;
          refreshTaskCount();
          if (task.is_done) {
            toggleBtn.style.transform = "scale(1.3)";
            setTimeout(function () {
              toggleBtn.style.transform = "scale(1)";
            }, 200);
            showNotification("Task completed! 🎉", "success");
          }
        })
        .catch(function (err) {
          console.error("Error toggling task:", err);
          showNotification("Failed to update task", "error");
        })
        .finally(function () {
          toggleBtn.disabled = false;
        });
    });
    deleteBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      li.style.transition = "all 0.3s ease";
      li.style.opacity = "0";
      li.style.transform = "translateX(50px)";
      setTimeout(function () {
        fetch("/api/todos/delete/" + task.id + "/", {
          method: "POST",
          headers: {
            "X-CSRFToken": getCookie("csrftoken"),
          },
        })
          .then(function (res) {
            if (!res.ok) throw new Error("Failed to delete task");
            return res.json();
          })
          .then(function () {
            li.remove();
            tasks = tasks.filter(function (t) {
              return t.id !== task.id;
            });
            refreshTaskCount();
            showNotification("Task deleted", "info");
          })
          .catch(function (err) {
            console.error("Error deleting task:", err);
            showNotification("Failed to delete task", "error");
            li.style.opacity = "1";
            li.style.transform = "translateX(0)";
          });
      }, 300);
    });
    todoList.appendChild(li);
  }

  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  function showNotification(message, type) {
    const notification = document.createElement("div");
    notification.className = "notification notification-" + type;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(function () {
      notification.style.animation = "slideOutRight 0.4s ease";
      setTimeout(function () {
        notification.remove();
      }, 400);
    }, 3000);
  }

  document.addEventListener("keydown", function (e) {
    if (
      (e.ctrlKey || e.metaKey) &&
      e.key === "Enter" &&
      document.activeElement === todoInput
    ) {
      e.preventDefault();
      addTask();
    }
  });

  function updateTaskCount() {
    const completedCount = tasks.filter(function (t) {
      return t.is_done;
    }).length;
    const totalCount = tasks.length;
    const todoCard = todoList.closest(".glass-card");
    if (todoCard) {
      const heading = todoCard.querySelector("h3");
      if (heading) {
        if (totalCount > 0) {
          heading.textContent =
            "To-Do / Reminders (" + completedCount + "/" + totalCount + ")";
        } else {
          heading.textContent = "To-Do / Reminders";
        }
      }
    }
  }

  function refreshTaskCount() {
    updateTaskCount();
  }
});
