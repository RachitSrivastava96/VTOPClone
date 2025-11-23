document.addEventListener("DOMContentLoaded", () => {
  const todoList = document.getElementById("todo-list");
  const todoInput = document.getElementById("todo-input");
  const todoAddBtn = document.getElementById("todo-add");

  fetch("/api/todos/")
    .then((res) => res.json())
    .then((tasks) => tasks.forEach(addTaskToUI));
  todoAddBtn.addEventListener("click", () => {
    const text = todoInput.value.trim();
    if (!text) return;
    fetch("/api/todos/add/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    })
      .then((res) => res.json())
      .then((task) => {
        addTaskToUI(task);
        todoInput.value = "";
      });
  });
  function addTaskToUI(task, skipAnimation = false) {
    if (document.querySelector(`[data-id="${task.id}"]`)) return;

    const li = document.createElement("li");
    li.dataset.id = task.id;
    li.classList.add("todo-item");
    li.innerHTML = `
        <span class="todo-text ${task.is_done ? "done" : ""}">${
      task.text
    }</span>
        <button class="todo-toggle">✓</button>
        <button class="todo-delete">✗</button>
    `;
    if (!skipAnimation) {
      li.classList.add("fade-in");
      setTimeout(() => li.classList.remove("fade-in"), 300);
    }
    li.querySelector(".todo-toggle").addEventListener("click", () => {
      fetch(`/api/todos/toggle/${task.id}/`, { method: "POST" }).then(() => {
        li.querySelector(".todo-text").classList.toggle("done");
      });
    });
    li.querySelector(".todo-delete").addEventListener("click", () => {
      li.classList.add("slide-out");
      setTimeout(() => {
        fetch(`/api/todos/delete/${task.id}/`, { method: "POST" }).then(() =>
          li.remove()
        );
      }, 250);
    });
    todoList.appendChild(li);
  }
});
