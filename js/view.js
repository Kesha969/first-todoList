import * as State from "./state.js";

// Получаем DOM элементы
const taskInput = document.querySelector('#task-input');
const addButton = document.querySelector('#add-button');
const taskList = document.querySelector('#task-list');
const taskCounter = document.querySelector('#task-counter');
const filterSelect = document.querySelector('#filter');

// Отображение задач
export function renderTasks(tasks, filter, onToggle, onDelete, onEdit, onStartEdit, onSelectTask) {
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
        const isEditing = State.getEditingTaskId() === task.id;
        const isSelected = State.getSelectedTaskId() === task.id;
        
        if (isEditing) {
            // Делаем весь элемент li некликабельным
            newItem.style.pointerEvents = 'none';
            
            const input = document.createElement('input');
            input.value = task.text;
            input.className = 'task-input';
            
            // Делаем ТОЛЬКО input кликабельным
            input.style.pointerEvents = 'auto';
            
            setTimeout(() => input.focus(), 0);
            
            input.addEventListener('blur', () => {
                onEdit(task.id, input.value);
                State.stopEditing();
            });
            
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') input.blur();
                if (e.key === 'Escape') {
                    State.stopEditing();
                    // refreshView() вызовется автоматически через onEdit
                }
            });
            
            newItem.appendChild(input);
            taskList.appendChild(newItem);
        } else {
            // Обычный режим - показываем span
            const taskText = document.createElement('span');
            taskText.textContent = task.text;
            taskText.className = 'task-text'; 

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

            newItem.addEventListener('dblclick', () => {
                if (!task.completed) {
                    onStartEdit(task.id);
                }
            });

            newItem.addEventListener('click', (e) => {
                // Проверяем что кликнули не по кнопкам
                if (e.target !== completeBtn && e.target !== deleteBtn) {
                    onSelectTask(task.id);
                }
            });

            taskList.appendChild(newItem);
        }
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