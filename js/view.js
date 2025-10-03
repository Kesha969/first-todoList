import * as State from "./state.js";

// Получаем DOM элементы
const taskInput = document.querySelector('#task-input');
const addButton = document.querySelector('#add-button');
const taskList = document.querySelector('#task-list');
const taskCounter = document.querySelector('#task-counter');
const overlay = document.querySelector('#overlay-modal');
const inputModal = document.querySelector('#input-modal');
const closeModal = document.querySelectorAll('.modal-cross');


function initFilterButtons() {
    const filterButtons = {
        all: document.querySelector('[data-filter="all"]'),
        checked: document.querySelector('[data-filter="checked"]'),
        unchecked: document.querySelector('[data-filter="unchecked"]')
    };
    
    filterButtons.all.innerHTML = SVG_Icons.list;
    filterButtons.checked.innerHTML = SVG_Icons.circleCheck;
    filterButtons.unchecked.innerHTML = SVG_Icons.circle;
}

const SVG_Icons = {
    check: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-icon lucide-check"><path d="M20 6 9 17l-5-5"/></svg>',
    trash: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
    list: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 5h.01"/><path d="M3 12h.01"/><path d="M3 19h.01"/><path d="M8 5h13"/><path d="M8 12h13"/><path d="M8 19h13"/></svg>',
    circleCheck: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>',
    circle: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>'    
};

// Отображение задач
export function renderTasks(tasks, filter, onToggle, onDelete, onEdit, onStartEdit, onSelectTask) {
    // Очищаем список перед рендерингом
    taskList.innerHTML = '';

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

            // Кнопка выполнения
            const completeBtn = document.createElement('button');
            completeBtn.className = 'complete-btn';

            if (task.completed) {
                completeBtn.classList.add('checked');
                completeBtn.style.backgroundColor = '#4CAF50';
                completeBtn.innerHTML = SVG_Icons.check;
            } else {
                completeBtn.style.backgroundColor = 'none';
                completeBtn.innerHTML = ''; 
            }
            
            completeBtn.onclick = function(e) {
                e.stopPropagation();
                onToggle(task.id);
            }

            // Кнопка удаления
            const deleteBtn = document.createElement('button');
            deleteBtn.className  = 'delete-btn';
            deleteBtn.innerHTML = SVG_Icons.trash;
            deleteBtn.onclick = function(e) {
                e.stopPropagation();
                onDelete(task.id);
            }
            
            // Собираем в правильном порядке
            newItem.appendChild(taskText); 
            newItem.appendChild(completeBtn);
            newItem.appendChild(deleteBtn);

            // Временное редактирование текста
            newItem.addEventListener('dblclick', () => {
                if (!task.completed) {
                    onStartEdit(task.id);
                }
            });

            // Для будущего открывающегося окна с более подробной информацией задачи
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
    initFilterButtons();
    return { 
        taskInput, 
        addButton, 
        taskList, 
        taskCounter 
    };
}

// Очистка строки ввода
export function clearInput() {
    taskInput.value = '';
}

// Фокус на строке ввода
export function focusInput() {
    taskInput.focus();
}

// Модальное окно
document.addEventListener('click', function(e) {
    // Открытие модалки по клику на "Добавить"
    if (e.target.closest('.input-modal')) {
        e.preventDefault();
        const modalElem = document.querySelector('.modal[data-modal="1"]');
        const overlay = document.querySelector('#overlay-modal');
        
        if (modalElem && overlay) {
            modalElem.classList.add('active');
            overlay.classList.add('active');
        }
    }
    
    // Закрытие модалки по клику на крестик
    if (e.target.closest('.modal-cross')) {
        const parentModal = e.target.closest('.modal');
        const overlay = document.querySelector('#overlay-modal');
        
        if (parentModal && overlay) {
            parentModal.classList.remove('active');
            overlay.classList.remove('active');
        }
    }
    
    // Закрытие модалки по клику на overlay
    if (e.target.id === 'overlay-modal') {
        const openModal = document.querySelector('.modal.active');
        if (openModal) {
            openModal.classList.remove('active');
            e.target.classList.remove('active');
        }
    }
});