const userToken = "WULVW";
const apiUrl = `https://iecd-js-july-2023-webapi.000webhostapp.com/?user_id=${userToken}`;
const loading = document.querySelector(".tasks__list__loading");
const couloms = document.querySelectorAll(".tasks__list__column");
const listProgresses = document.createElement("section");
let progresses = [
  { id: 0, name: "ui-ux", max: 0, min: 0 },
  { id: 1, name: "frontend", max: 0, min: 0 },
  { id: 2, name: "asp", max: 0, min: 0 },
  { id: 3, name: "database", max: 0, min: 0 },
];
fetch(apiUrl)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    loading.classList.add("hidden");
    for (const task of data) {
      let container = document.createElement("div");
      container.classList.add("task");
      container.setAttribute("data-task-id", `${task.id}`);
      container.setAttribute("draggable", `true`);
      container.innerHTML = `<div class="task__department"></div>
      <p style=' font-size: 18px;font-weight: 600'>${task.title}</p>
      <p>${task.description}</p>
      <p style="color: #969696; font-size: 14px">${task.task_date}</p></div>`;
      for (const el of couloms) {
        el.classList.remove("hidden");
        if (el.getAttribute("data-status") === task.status) {
          el.appendChild(container);
        }
      }
      //feltir by departments
      let departments = document.querySelectorAll(".task__department");
      for (const department of departments) {
        if (task.department_id === "0" && department.innerHTML === "") {
          department.innerHTML = `<span class="task__department--ui-ux">UI-UX</span>`;
        } else if (task.department_id === "1" && department.innerHTML === "") {
          department.innerHTML = `<span class="task__department--frontend">Frontend</span>`;
        } else if (task.department_id === "2" && department.innerHTML === "") {
          department.innerHTML = `<span class="task__department--asp">Asp.Net</span>`;
        } else if (task.department_id === "3" && department.innerHTML === "") {
          department.innerHTML = `<span class="task__department--database">Database</span>`;
        }
      }
    }
  })
  .then(() => {
    updateprogresses();
  });
//events darag and drop with web api
let tx = null;
document.querySelectorAll(".tasks__list__column").forEach((el) => {
  el.addEventListener("dragstart", (e) => {
    tx = e.target.closest(".task");
    e.dataTransfer.setData("text/plain", tx.getAttribute("data-task-id"));
  });
});
document.querySelectorAll(".tasks__list__column").forEach((coulom) => {
  coulom.addEventListener("dragenter", (e) => {
    coulom.style.border = "3px dashed #";
  });
  coulom.addEventListener("dragleave", (e) => {
    coulom.style.border = "none";
  });
  coulom.addEventListener("dragover", (e) => {
    coulom.style.border = "3px dashed #969696";
    e.preventDefault();
    return false;
  });
  coulom.addEventListener("drop", (e) => {
    document.querySelectorAll(".tasks__list__column").forEach((dz) => {
      dz.style.border = "none";
    });
    coulom.appendChild(tx);
    let newId = e.dataTransfer.getData("text");
    let newStatus = coulom.getAttribute("data-status");
    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        task_id: newId,
        status: newStatus,
      }),
    });
    updateprogresses();
    return false;
  });
}); //function updateprogresses
function updateprogresses() {
  for (const progress of progresses) {
    progress.min = 0;
    progress.max = 0;
    for (let index = 0; index < couloms.length; index++) {
      couloms[index].querySelectorAll("span").forEach((e) => {
        if (e.className === `task__department--${progress.name}`) {
          if (index === 3) {
            progress.min++;
          }
          progress.max++;
        }
      });
    }
  }
  let paretntprog = document.querySelector(".tasks-progresses");
  listProgresses.innerHTML = " ";
  for (const prog of progresses) {
    let el = document.createElement("div");
    el.className = `task-progress progress--${prog.name}`;
    el.innerHTML = ` <p>${prog.name.toUpperCase()}<span>${prog.max}/${
      prog.min
    }</span></p>
    <progress max="${prog.max}" value="${prog.min}">${prog.min}</progress>`;
    listProgresses.appendChild(el);
  }
  paretntprog.appendChild(listProgresses);
}
