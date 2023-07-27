const localStorageData = localStorage.getItem("tasks");
const setLocalStorage = () => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

let tasks = JSON.parse(localStorageData) || [];

let taskDescriptionEl = document.querySelector("#description");
let taskDeadlineEl = document.querySelector("#deadline");

const tasksWrapper = document.getElementById("tasksWrapper");
const sortingSelect = document.getElementById("sortingSelect");

const formatTimeRemaining = (milliseconds) => {
  if (!milliseconds) {
    return;
  }

  const totalMinutes = Math.floor(milliseconds / (1000 * 60));

  if (totalMinutes < 0) {
    return "Expired";
  }

  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  return `${days}d ${hours}h ${minutes}m`;
};

const renderTasks = () => {
  tasksWrapper.innerHTML = "";

  tasks.forEach((task) => {
    const singleTaskContainer = document.createElement("div");
    const buttonContainer = document.createElement("div");
    const removeTaskContainer = document.createElement("div");
    const removeTask = document.createElement("button");
    const completeTaskContainer = document.createElement("div");
    const completeTask = document.createElement("input");
    const taskContentWrapper = document.createElement("div");
    const taskContent = document.createElement("p");
    const taskFooter = document.createElement("div");

    tasksWrapper.appendChild(singleTaskContainer);

    singleTaskContainer.appendChild(taskContentWrapper);
    singleTaskContainer.appendChild(taskFooter);
    singleTaskContainer.appendChild(buttonContainer);
    singleTaskContainer.classList.add("card");
    singleTaskContainer.setAttribute("data-id", task.id);

    if (task.completed) {
      singleTaskContainer.style.backgroundColor = "rgba(200, 200, 200, 0.5)";
    }

    buttonContainer.appendChild(completeTaskContainer);
    buttonContainer.appendChild(removeTaskContainer);
    buttonContainer.classList.add("button-container");

    completeTaskContainer.appendChild(completeTask);
    completeTaskContainer.classList.add("complete-task-container");

    completeTask.classList.add("checkbox");
    completeTask.setAttribute("type", "checkbox");
    completeTask.dataset.taskId = task.id;

    if (task.completed) {
      completeTask.setAttribute("checked", "true");
      completeTask.setAttribute("disabled", "true");
    }

    removeTaskContainer.appendChild(removeTask);
    removeTaskContainer.classList.add("remove-task-container");

    removeTask.innerHTML = "&#10006;";
    removeTask.classList.add("remove-task");
    removeTask.dataset.taskId = task.id;

    taskContentWrapper.classList.add("card-content-wrapper");

    taskContentWrapper.appendChild(taskContent);
    taskContent.innerHTML = task.description;
    taskContent.classList.add("card-content");

    if (task.completed) {
      taskContent.classList.add("completed");
    }

    taskFooter.innerHTML = task.deadline || "";
    taskFooter.classList.add("card-footer");

    removeTask.addEventListener("click", (e) => {
      const confirmation = confirm(
        "Are you sure you want to delete this task?"
      );

      if (confirmation) {
        tasks = tasks.filter((t) => t.id !== parseInt(e.target.dataset.taskId));
        handleTasks();
      }
    });

    completeTask.addEventListener("click", (e) => {
      const taskId = parseInt(e.target.dataset.taskId);
      const completedTask = tasks.find((t) => t.id === taskId);
      const index = tasks.findIndex((t) => t.id === taskId);
      tasks[index].completed = true;
      tasks[index].completedWhen = Date.now();
      tasks.splice(index, 1);
      tasks.push(completedTask);
      handleTasks();
    });

    resetValues();
  });
};

const addTask = () => {
  if (!validation()) {
    return;
  }

  const deadlineInUnixTimestamp = Date.parse(new Date(taskDeadlineEl.value));

  tasks.push({
    id: Date.now(),
    description: taskDescriptionEl.value,
    deadline: formatTimeRemaining(deadlineInUnixTimestamp - Date.now()),
    deadlineInMilliseconds: deadlineInUnixTimestamp,
    completed: false,
    completedWhen: 0,
  });

  handleTasks();
};

const sortByRecentlyAdded = () => {
  tasks.sort((a, b) => b.id - a.id);
  handleTasks();
};

const sortByDeadline = () => {
  tasks.sort((a, b) => a.deadlineInMilliseconds - b.deadlineInMilliseconds);
  handleTasks();
};

const sortByCompleted = () => {
  tasks.sort((a, b) => b.completedWhen - a.completedWhen);
  handleTasks();
};

const sortTasks = () => {
  const selectedOptionValue = sortingSelect.value;
  switch (selectedOptionValue) {
    case "Recently added":
      sortByRecentlyAdded();
      break;
    case "Deadline":
      sortByDeadline();
      break;
    case "Recently completed":
      sortByCompleted();
      break;
  }
};

const handleTasks = () => {
  setLocalStorage();
  renderTasks();
};

const validation = () => {
  if (taskDescriptionEl.value === "") {
    alert("Please enter a description!");
    return;
  }

  return true;
};

const resetValues = () => {
  taskDescriptionEl.value = "";
  taskDeadlineEl.value = "";
};

const init = () => {
  renderTasks();
  sortingSelect.value = "Recently added";
  sortByRecentlyAdded();
};

sortingSelect.addEventListener("change", sortTasks);
document.querySelector(".btn").addEventListener("click", addTask);
init();
