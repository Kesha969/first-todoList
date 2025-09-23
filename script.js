const taskInput = document.querySelector('#task-input');
const addButton = document.querySelector('#add-button');
const taskList = document.querySelector('#task-list');

addButton.addEventListener('click', function() {
    const taskText = taskInput.value;

    const newItem = document.createElement('li');
    newItem.textContent = taskText;

    taskList.appendChild(newItem);

    taskInput.value = '';
})