document.addEventListener("DOMContentLoaded", () => {
  const todoList = document.getElementById("todo-list");
  const todoInput = document.getElementById("todo-input");
  const todoAddBtn = document.getElementById("todo-add");

  if (!todoList || !todoInput || !todoAddBtn) return;

  let tasks = [];

  /* ==================== LOAD TASKS ==================== */
  function loadTasks() {
    fetch("/api/todos/")
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch tasks');
        return res.json();
      })
      .then((fetchedTasks) => {
        tasks = fetchedTasks;
        tasks.forEach(task => addTaskToUI(task, true));
        refreshTaskCount();
      })
      .catch((err) => {
        console.error('Error loading tasks:', err);
        showNotification('Failed to load tasks', 'error');
      });
  }

  loadTasks();

  /* ==================== ADD TASK ==================== */
  function addTask() {
    const text = todoInput.value.trim();
    if (!text) {
      todoInput.style.animation = 'shake 0.3s ease';
      setTimeout(() => todoInput.style.animation = '', 300);
      return;
    }

    // Disable button while adding
    todoAddBtn.disabled = true;
    todoAddBtn.textContent = 'Adding...';

    fetch("/api/todos/add/", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie('csrftoken')
      },
      body: JSON.stringify({ text }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to add task');
        return res.json();
      })
      .then((task) => {
        tasks.push(task);
        addTaskToUI(task);
        todoInput.value = "";
        refreshTaskCount();
        showNotification('Task added successfully! ✓', 'success');
      })
      .catch((err) => {
        console.error('Error adding task:', err);
        showNotification('Failed to add task', 'error');
      })
      .finally(() => {
        todoAddBtn.disabled = false;
        todoAddBtn.textContent = 'Add';
      });
  }

  // Add task on button click
  todoAddBtn.addEventListener("click", addTask);

  // Add task on Enter key
  todoInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      addTask();
    }
  });

  /* ==================== ADD TASK TO UI ==================== */
  function addTaskToUI(task, skipAnimation = false) {
    // Check if task already exists
    if (document.querySelector(`[data-id="${task.id}"]`)) return;

    const li = document.createElement("li");
    li.dataset.id = task.id;
    li.classList.add("todo-item");
    
    // Create task elements
    const taskText = document.createElement("span");
    taskText.className = `todo-text ${task.is_done ? "done" : ""}`;
    taskText.textContent = task.text;
    
    const toggleBtn = document.createElement("button");
    toggleBtn.className = "todo-toggle";
    toggleBtn.innerHTML = "✓";
    toggleBtn.title = "Toggle completion";
    
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "todo-delete";
    deleteBtn.innerHTML = "✗";
    deleteBtn.title = "Delete task";
    
    // Add elements to list item
    li.appendChild(taskText);
    li.appendChild(toggleBtn);
    li.appendChild(deleteBtn);

    // Add animation
    if (!skipAnimation) {
      li.style.opacity = '0';
      li.style.transform = 'translateY(20px)';
      setTimeout(() => {
        li.style.transition = 'all 0.4s ease';
        li.style.opacity = '1';
        li.style.transform = 'translateY(0)';
      }, 10);
    }

    /* ==================== TOGGLE TASK ==================== */
    toggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      
      toggleBtn.disabled = true;
      
      fetch(`/api/todos/toggle/${task.id}/`, { 
        method: "POST",
        headers: {
          "X-CSRFToken": getCookie('csrftoken')
        }
      })
        .then((res) => {
          if (!res.ok) throw new Error('Failed to toggle task');
          return res.json();
        })
        .then(() => {
          taskText.classList.toggle("done");
          task.is_done = !task.is_done;
          refreshTaskCount();
          
          // Add completion effect
          if (task.is_done) {
            toggleBtn.style.transform = 'scale(1.3)';
            setTimeout(() => toggleBtn.style.transform = 'scale(1)', 200);
            showNotification('Task completed! 🎉', 'success');
          }
        })
        .catch((err) => {
          console.error('Error toggling task:', err);
          showNotification('Failed to update task', 'error');
        })
        .finally(() => {
          toggleBtn.disabled = false;
        });
    });

    /* ==================== DELETE TASK ==================== */
    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      
      // Add exit animation
      li.style.transition = 'all 0.3s ease';
      li.style.opacity = '0';
      li.style.transform = 'translateX(50px)';
      
      setTimeout(() => {
        fetch(`/api/todos/delete/${task.id}/`, { 
          method: "POST",
          headers: {
            "X-CSRFToken": getCookie('csrftoken')
          }
        })
          .then((res) => {
            if (!res.ok) throw new Error('Failed to delete task');
            return res.json();
          })
          .then(() => {
            li.remove();
            tasks = tasks.filter(t => t.id !== task.id);
            refreshTaskCount();
            showNotification('Task deleted', 'info');
          })
          .catch((err) => {
            console.error('Error deleting task:', err);
            showNotification('Failed to delete task', 'error');
            // Restore item if delete failed
            li.style.opacity = '1';
            li.style.transform = 'translateX(0)';
          });
      }, 300);
    });

    todoList.appendChild(li);
  }

  /* ==================== UTILITY FUNCTIONS ==================== */
  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      padding: 16px 24px;
      background: rgba(255, 255, 255, 0.95);
      color: #333;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.2);
      z-index: 10000;
      animation: slideInRight 0.4s ease;
      font-weight: 600;
      backdrop-filter: blur(10px);
    `;
    
    if (type === 'success') {
      notification.style.background = 'rgba(72, 187, 120, 0.95)';
      notification.style.color = 'white';
    } else if (type === 'error') {
      notification.style.background = 'rgba(255, 107, 107, 0.95)';
      notification.style.color = 'white';
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.4s ease';
      setTimeout(() => notification.remove(), 400);
    }, 3000);
  }

  /* ==================== ADD CSS ANIMATIONS ==================== */
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-10px); }
      75% { transform: translateX(10px); }
    }
    
    @keyframes slideInRight {
      from {
        opacity: 0;
        transform: translateX(100px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
    
    @keyframes slideOutRight {
      from {
        opacity: 1;
        transform: translateX(0);
      }
      to {
        opacity: 0;
        transform: translateX(100px);
      }
    }
    
    .todo-item {
      transition: all 0.3s ease;
    }
    
    .todo-toggle,
    .todo-delete {
      transition: all 0.2s ease;
    }
  `;
  document.head.appendChild(style);

  /* ==================== KEYBOARD SHORTCUTS ==================== */
  document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to add task when input is focused
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && document.activeElement === todoInput) {
      e.preventDefault();
      addTask();
    }
  });

  /* ==================== SHOW TASK COUNT ==================== */
  function updateTaskCount() {
    const completedCount = tasks.filter(t => t.is_done).length;
    const totalCount = tasks.length;
    
    const todoCard = todoList.closest('.glass-card');
    if (todoCard) {
      const heading = todoCard.querySelector('h3');
      if (heading) {
        if (totalCount > 0) {
          heading.textContent = `To-Do / Reminders (${completedCount}/${totalCount})`;
        } else {
          heading.textContent = 'To-Do / Reminders';
        }
      }
    }
  }

  // Update count when tasks change
  function refreshTaskCount() {
    updateTaskCount();
  }

});