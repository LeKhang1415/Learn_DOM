const tasks = [];

const taskList = document.querySelector("#task-list");
const taskForm = document.querySelector("#todo-form");
const taskInput = document.querySelector("#todo-input");

taskList.onclick = function (e) {
    const taskItem = e.target.closest(".task-item");
    const taskIndex = +taskItem.getAttribute("task-index");
    const task = tasks[taskIndex];

    if (e.target.closest(".edit")) {
        const newTitle = prompt("Enter the new task title:", task.title);
        if (!newTitle) return;
        if (newTitle.trim() === "") {
            alert("Task title cannot be empty.");
            return;
        }
        task.title = newTitle.trim();
        renderTasks();
    } else if (e.target.closest(".done")) {
        task.completed = !task.completed;
        renderTasks();
    } else if (e.target.closest(".delete")) {
        if (confirm("Are you sure you want to delete this task?")) {
            tasks.splice(taskIndex, 1);
            renderTasks();
        }
    }
};

function renderTasks() {
    if (tasks.length === 0) {
        taskList.innerHTML = `<li class="empty-message">No tasks available.</li>`;
        return;
    }

    const html = tasks
        .map(
            (task, index) =>
                `<li class="task-item ${
                    task.completed ? "completed" : ""
                } task-index="${index}"">
        <span class="task-title">${task.title}</span>
            <div class="task-action">
                <button class="task-btn edit">Edit</button>
                <button class="task-btn done">${
                    task.completed ? "Mark as undone" : "Mark as done"
                }</button>
                <button class="task-btn delete">Delete</button>
            </div>
     </li>`
        )
        .join(" ");

    taskList.innerHTML = html;
}

taskForm.onsubmit = (e) => {
    e.preventDefault();
    const taskTitle = taskInput.value.trim();
    if (!taskTitle) {
        alert("Please enter a task title.");
        return;
    }

    const newTask = {
        title: taskTitle,
        completed: false,
    };

    tasks.push(newTask);
    taskInput.value = "";
    taskInput.focus();
    renderTasks();
};

renderTasks();
