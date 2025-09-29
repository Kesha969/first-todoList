import { toggleTaskCompletion } from "./state.js";
import { deleteTask } from "./state.js";

// Получаем DOM элементы
const taskInput = document.querySelector('#task-input');
const addButton = document.querySelector('#add-button');
const taskList = document.querySelector('#task-list');
const taskCounter = document.querySelector('#task-counter');
const filterSelect = document.querySelector('#filter');

// Отображение задач
export function renderTasks(tasks, filter, onToggle, onDelete) {
    // Очищаем список перед рендерингом
    taskList.innerHTML = '';

    // Обновляем счетчик задач
    updateCounter(tasks);

    let tasksToShow = []
    switch(filter) {
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
        // Кнопка выполнения
        completeBtn.onclick = function(e) {
            e.stopPropagation();
            onToggle(task.id);
        }

        // Кнопка удаления
        const deleteBtn = document.createElement('button');
        deleteBtn.className  = 'delete-btn';
        deleteBtn.innerHTML = '';
        deleteBtn.onclick = function(e) {
            e.stopPropagation();
            onDelete(task.id);
        }

        // Собираем в правильном порядке
        newItem.appendChild(taskText); 
        newItem.appendChild(completeBtn);
        newItem.appendChild(deleteBtn);
        taskList.appendChild(newItem);
    });
}

// Обработка счетчика
export function updateCounter(tasks) {
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

// Получение DOM элементов
export function getDOMElements() {
    return { taskInput, addButton, taskList, taskCounter, filterSelect };
}

// Очистка строки ввода
export function clearInput() {
    taskInput.value = '';
}

// Фокус на строке ввода
export function focusInput() {
    taskInput.focus();
}