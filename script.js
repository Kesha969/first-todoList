const taskInput = document.querySelector('#task-input');
const addButton = document.querySelector('#add-button');
const taskList = document.querySelector('#task-list');
let select = document.querySelector('#filter');
let filterSelect = document.querySelector('#filter');

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

// Загружаем фильтр из localStorage при загрузке страницы
let currentFilter = 'all'; // значение по умолчанию

try {
    const storedFilter = localStorage.getItem('filter');
    if (storedFilter) {
        currentFilter = storedFilter;
    }
} catch (err) {
    console.error('Ошибка загрузки фильтра: ', err);
}
// Устанавливаем выбранное значение в select
filterSelect.value = currentFilter;

// Функция для сохранения задач в localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Функция для сохранения фильтра в localStorage
function saveFilter() {
    localStorage.setItem('filter', filterSelect.value);
}

// Функция для обновления счетчика задач
function updateTasksCounter() {
    const totalCounter = document.querySelector('#total-counter');
    const completedCounter = document.querySelector('#completed-counter');
    const uncompletedCounter = document.querySelector('#uncompleted-counter');

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const uncompletedTasks = totalTasks - completedTasks;

    totalCounter.textContent = totalTasks;
    completedCounter.textContent = completedTasks;
    uncompletedCounter.textContent = uncompletedTasks;
}

// Функция для отрисовки списка задач
function renderTasks() {
    // Очищаем список перед рендерингом
    taskList.innerHTML = '';

    // Обновляем счетчик задач
    updateTasksCounter();

    let tasksToShow = []
    switch(currentFilter) {
        case 'all':
            tasksToShow = tasks;
        break;
        case 'checked':
            tasksToShow = tasks.filter(task => task.completed);
        break;
        case 'unchecked':
            tasksToShow = tasks.filter(task => !task.completed);;
        break;
    }

    // Создаем элементы для каждой задачи
    tasksToShow.forEach((task, index) => {
        const newItem = document.createElement('li');
        
        // Создаем отдельный элемент для текста задачи
        const taskText = document.createElement('span');
        taskText.textContent = task.text;
        taskText.className = 'task-text'; // Добавляем класс для текста

        // Класс для выполнения задач (только для текста)
        if (task.completed) {
            taskText.classList.add('completed');
        }

        // Создаем элемент для галочки
        const checkmark = document.createElement('span');
        checkmark.style.cssText = 'color: white; font-weight: bold; font-size: 12px;';

        // Кнопка выполнения
        const completeBtn = document.createElement('button');
        completeBtn.className = 'complete-btn';
        
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
            toggleTaskCompletion(task.id);
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
    saveTasks();
    renderTasks();

    // Очищаем поле ввода
    taskInput.value = '';
    document.getElementById('task-input').focus();

}

// Фильтр задач
function taskFilter(select) {
    if (tasksFiltered && tasks.length > 0) {
        tasksFiltered = tasksFiltered.filter(task => task.completed !== select);
    }
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

// Переключение статуса выполнения
function toggleTaskCompletion(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;

        //сохраняем и рендерим
        saveTasks();
        renderTasks();
    }
    document.getElementById('task-input').focus();
}

// Обработчик событий для addButton
addButton.addEventListener('click', addTask);

// Обработчик событий для select
filterSelect.addEventListener('change', function() {
    currentFilter = filterSelect.value; // обновляем текущий фильтр
    saveFilter(); // сохраняем в localStorage
    renderTasks(); // перерисовываем задачи
});

// Добавление задачи при нажатии 'Enter'
taskInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

// При загрузке страницы
renderTasks();
window.onload = () => document.getElementById('task-input').focus();
