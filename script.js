const taskInput = document.querySelector('#task-input');
const addButton = document.querySelector('#add-button');
const taskList = document.querySelector('#task-list');


addButton.addEventListener('click', function() {
    const taskText = taskInput.value;

    // Создаем элемент списка
    const newItem = document.createElement('li');
    newItem.textContent = taskText;

    // Создаем кнопку удаления
    const deleteBtn = document.createElement('button');
    deleteBtn.className  = 'delete-btn';
    deleteBtn.innerHTML = 'x';
    deleteBtn.onclick = function(e) {
        e.stopPropagation(); // при клике на крестик не срабатывал клик на задаче
        this.parentElement.remove();
    }
    // Добавляем кнопку к задаче
    newItem.appendChild(deleteBtn);
    
    // Добавляем задачу в список
    taskList.appendChild(newItem);

    // Очищаем поле ввода
    taskInput.value = '';
})

