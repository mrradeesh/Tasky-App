const state = {
  taskList: [],
};

let task_modal = document.querySelector(".task__modal__body");
let task_content = document.querySelector(".task__contents");

const htmlTaskContent = ({ id, title, description, type, url }) =>
  ` <div class="col-md-6 col-lg-4 mt-3" id=${id} key=${id}>
  <div class="card m-3 shadow-lg task__card ">
    <div class="card-header d-flex justify-content-end task_card_header gap-1">
        <button class="btn btn-outline-primary" name=${id} ><i class="fa-solid fa-pencil" name=${id} onclick='editTask.apply(this,arguments)'></i></button>
        <button class="btn btn-outline-danger" name=${id} onclick='deleteTask()'><i class="fa-solid fa-trash" name=${id} ></i></button>
    </div>
    ${url
    ? `<img src=${url}
        class="card-img-top" alt="Image">`
    : `<img src="https://raw.githubusercontent.com/mrradeesh/Tic-Tac-Toe/c197c836a03c8ad7be7f95e8788a95fada1d9373/coorg-trip.png"
        class="card-img-top" alt="Image">`
  }
    
    <div class="card-body">
        <h5 class="card-title">${title}</h5>
        <p class="card-text text-secondary">${type}</p>
        <p class="badge bg-primary m-2 mb-3">${description}</p>
        <div class="card-footer">
            <button type="button" class="btn btn-primary  float-right" data-bs-toggle="modal" data-bs-target="#showTask" onclick='openTask()' id=${id}>Open Task</button>
        </div>
    </div>
</div>`;

const htmlModalContent = ({ id, title, description, url }) => {
  const date = new Date(parseInt(id));

  return `<div id=${id}">
${
  url
      ?`<img src=${url}
    class="card-img-top" alt="Image">`
      :`<img src="https://raw.githubusercontent.com/mrradeesh/Tic-Tac-Toe/c197c836a03c8ad7be7f95e8788a95fada1d9373/coorg-trip.png"
    class="card-img-top" alt="Image">`
    }
            <strong class='text-muted text-sm'>Created on:${date.toDateString()}</strong>
            <h1 class='my-3'>${title}</h1>
            <div class="text-muted">${description}</div>
        </div>`;
};


const updateLocalString = () => {
  localStorage.setItem(
    "task",
    JSON.stringify({ 
      tasks: state.taskList,
    })
    );
};
const loadinitData = () => {
//  console.log("loadinitData");
  const localStorageCopy = JSON.parse(localStorage.task);
  if (localStorageCopy) {
    state.taskList = localStorageCopy.tasks;
  }
  state.taskList.map((cardDate) => {
    task_content.insertAdjacentHTML("beforeend", htmlTaskContent(cardDate));
  });
};
const handleSubmit = (event) => {
  const id = Date.now();
  const input = {
    url: document.getElementById("imageURL").value,
    title: document.getElementById("cardTitle").value,
    type: document.getElementById("tasktype").value,
    description: document.getElementById("taskDescription").value,
  };
  if (input.description === "" || input.title === "" || input.type === "") {
    return alert("Please Fill the Required Field");
  }
  task_content.insertAdjacentHTML(
    "beforeend",
    htmlTaskContent({ ...input, id })
  );
  state.taskList.push({ ...input, id });
  updateLocalString();
};
const openTask = (e) => {
  if(!e) e = window.event;
  const getTask=state.taskList.find(({id})=> id == e.target.id);
  task_modal.innerHTML =htmlModalContent(getTask);
}

const deleteTask = (e) => {
  if(!e) e = window.event;
  const targetId = e.target.getAttribute("name");
  //console.log(targetId);
  const type = e.target.tagName;
  const removeItem = state.taskList.filter((i) => i.id != targetId);
  updateLocalString();

  if(type == "BUTTON"){
    e.target.parentNode.parentNode.parentNode.parentNode.removeChild(e.target.parentNode.parentNode.parentNode)
  }
  else  if(type == "I"){
    e.target.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild(e.target.parentNode.parentNode.parentNode.parentNode)
  }
}

const editTask = (e) => {
if(!e) e =window.event;
let parentNode;
let taskTitle;
let taskType;
let taskDescription;
let taskSubmission;
targetId =e.target.getAttribute("name");
type = e.target.tagName;
if(type == "BUTTON"){
  parentNode=e.target.parentNode.parentNode;
}
else if(type == "I"){
  parentNode=e.target.parentNode.parentNode.parentNode;
}
// console.log(targetId,type);
taskTitle = parentNode.childNodes[5].childNodes[1];
taskDescription = parentNode.childNodes[5].childNodes[3];
taskType = parentNode.childNodes[5].childNodes[5];
taskSubmission = parentNode.childNodes[5].childNodes[7].childNodes[1];

taskTitle.setAttribute("contenteditable", "true");
taskDescription.setAttribute("contenteditable", "true");
taskType.setAttribute("contenteditable", "true");

taskSubmission.setAttribute("onclick","saveEdit.apply(this,arguments)")
taskSubmission.removeAttribute("data-bs-toggle");
taskSubmission.removeAttribute("data-bs-target");
taskSubmission.innerHTML = "Save changes";

//console.log(taskSubmission.getAttribute("data-bs-toggle"));
// console.log(parentNode.childNodes[5].childNodes[5]);
// parentNode.childNodes[5].childNodes[7].childNodes[1]
}

const saveEdit= (e) => {
  if(!e) e=window.event;
  const targetId =e.target.id;
  const parentNode =e.target.parentNode.parentNode;
  //console.log(parentNode);
  const taskTitle=parentNode.childNodes[1];
  const taskType=parentNode.childNodes[3];
  const taskDescription=parentNode.childNodes[5];
  const submitButton = parentNode.childNodes[7].childNodes[1]; 
  const updateData = {
    title:taskTitle.innerHTML,
    type:taskType.innerHTML,
    description:taskDescription.innerHTML
  }

  let stateCopy =state.taskList;

  stateCopy=stateCopy.map((task) => task.id==targetId?{
    id:task.id,
    title:updateData.title,
    description :updateData.description,
    type: updateData.type,
    url:task.url
  }:task
  );
state.taskList=stateCopy;
updateLocalString();
//console.log(parentNode.childNodes[7].childNodes[1]);
submitButton.setAttribute("onclick", "openTask.apply(this, arguments)");
submitButton.setAttribute("data-bs-toggle","modal");
submitButton.setAttribute("data-bs-target","#showTask");
submitButton.innerHTML = "Open Task";
taskTitle.setAttribute("contenteditable", "false");
taskDescription.setAttribute("contenteditable", "false");
taskType.setAttribute("contenteditable", "false");
}

const searchTask = (e) => {
if(!e) e=window.event;

while(task_content.firstChild){
  task_content.removeChild(task_content.firstChild)
}

  const resultData = state.taskList.filter(({ title }) =>
    title.toLowerCase().includes(e.target.value.toLowerCase())
    );

console.log(resultData);
resultData.map(
  (cardData) =>
    task_content.insertAdjacentHTML("beforeend", htmlTaskContent(cardData))
);
};