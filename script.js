const taskInput = document.querySelector('#task-input');
const addButton = document.querySelector('#add-button');
const taskList = document.querySelector('#task-list');

// Загружаем задачи из localStorage при загрузке страницы
let tasks = [];
try {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
    }
}
catch (err) {
    console.error('Ошибка загрузки задач: ', err);
    tasks = [];

}

// Функция для сохранения задач в localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Функция для отрисовки списка задач
function renderTasks() {
    // Очищаем список перед рендерингом
    taskList.innerHTML = '';

    // Создаем элементы для каждой задачи
    tasks.forEach((task, index) => {
        const newItem = document.createElement('li');
        
        // Создаем отдельный элемент для текста задачи
        const taskText = document.createElement('span');
        taskText.textContent = task.text;
        taskText.className = 'task-text'; // Добавляем класс для текста

        // Класс для выполнения задач (только для текста)
        if (task.completed) {
            taskText.classList.add('completed');
        }

        // Кнопка выполнения
        const completeBtn = document.createElement('button');
        completeBtn.className = 'complete-btn';

        // Создаем элемент для галочки
        const checkmark = document.createElement('span');
        checkmark.style.cssText = 'color: white; font-weight: bold; font-size: 12px;';
        
        if (task.completed) {
            completeBtn.classList.add('checked');
            completeBtn.style.backgroundColor = '#4CAF50';
            checkmark.textContent = '✓';
        } else {
            completeBtn.style.backgroundColor = 'none';
            checkmark.textContent = '';
        }
        
        completeBtn.appendChild(checkmark);
        completeBtn.onclick = function(e) {
            e.stopPropagation();
            toggleTaskCompletion(index);
        }

        // Кнопка удаления
        const deleteBtn = document.createElement('button');
        deleteBtn.className  = 'delete-btn';
        deleteBtn.innerHTML = '';
        deleteBtn.onclick = function(e) {
            e.stopPropagation(); // при клике на крестик не срабатывал клик на задаче
            deleteTask(task.id);
        }

        // Собираем в правильном порядке
        newItem.appendChild(taskText); 
        newItem.appendChild(completeBtn);
        newItem.appendChild(deleteBtn);
        taskList.appendChild(newItem);
    });
}
// Добавление новой задачи
function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText === '') return;

    // Добавление задачи в массив
    tasks.push({
        id: crypto.randomUUID(),
        text: taskText,
        completed: false
    });

    // Сохраняем и рендерим
    tasks.unshift();
    saveTasks();
    renderTasks();

    // Очищаем поле ввода
    taskInput.value = '';
    document.getElementById('task-input').focus();

}

// Удаление задачи
function deleteTask(id) {
    if (tasks && tasks.length > 0) {
        tasks = tasks.filter(task => task.id !== id); // Удаляем из массива
    }
    else {
        tasks = [];
    }

    // Сохраняем и рендерим
    saveTasks();
    renderTasks();
    document.getElementById('task-input').focus();
}

// Переключение статуса выролнения
function toggleTaskCompletion(index) {
    tasks[index].completed = !tasks[index].completed;
    
    // Сохраняем и рендерим
    saveTasks();
    renderTasks();
    document.getElementById('task-input').focus();

}

// Обработчик событий
addButton.addEventListener('click', addTask);

// Добавление задачи при нажатии 'Enter'
taskInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

// При загрузке страницы
renderTasks();
window.onload = () => document.getElementById('task-input').focus();
