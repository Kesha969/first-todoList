import * as State from "./state.js";

// Получаем DOM элементы
const addButton = document.querySelector('#add-button');
const taskList = document.querySelector('#task-list');
const taskCounter = document.querySelector('#task-counter');
const overlay = document.querySelector('#overlay-modal');
const inputModal = document.querySelector('#input-modal');
const closeModal = document.querySelectorAll('.modal-cross');

function getFormData() {
    const titleField = document.querySelector('#task-title');
    const descField = document.querySelector('#task-description');
    const dateField = document.querySelector('#task-date');
    const timeField = document.querySelector('#task-time');
    const activePrio = document.querySelector('.prio-btn.active');
    
    // Проверка что элементы найдены
    if (!titleField || !dateField || !timeField || !activePrio) {
        console.error('Form elements not found');
        return null;
    }
    
    return {
        title: titleField.value,
        description: descField ? descField.value : '',
        date: dateField.value,
        time: timeField.value,
        prio: activePrio.getAttribute('prio')
    };
}

function getFormDataEdit() {
    console.log("=== getFormDataEdit вызван ===");
    
    // Поиск элементов формы редактирования
    const titleField = document.querySelector('#task-title-edit');
    const descriptionField = document.querySelector('#task-description-edit');
    const dateField = document.querySelector('#task-date-edit');
    const timeField = document.querySelector('#task-time-edit');
    const prioField = document.querySelector('.prio-btn-edit.active');
    
    console.log("Найденные элементы:");
    console.log("titlefield:", titleField);
    console.log("description:", descriptionField);
    console.log("datefield:", dateField);
    console.log("timefield:", timeField);
    
    // Проверка, что все элементы найдены
    if (!titleField || !descriptionField || !dateField || !timeField) {
        console.log("❌ Form elements not found");
        return null;
    }
    
    // Сбор данных формы
    const formData = {
        title: titleField.value.trim(),
        description: descriptionField.value.trim(),
        date: dateField.value,
        time: timeField.value,
        prio: prioField.getAttribute('prio')
    };
    
    console.log("✅ Form data collected:", formData);
    return formData;
}

function initFilterButtons() {
    const filterButtons = {
        all: document.querySelector('[data-filter="all"]'),
        checked: document.querySelector('[data-filter="checked"]'),
        unchecked: document.querySelector('[data-filter="unchecked"]'),
        dueAll: document.querySelector('[data-due-filter="all"]'),
        dueSoon: document.querySelector('[data-due-filter="due-soon"]'),
        overdue: document.querySelector('[data-due-filter="overdue"]'),
        priorAll: document.querySelector('[data-prior-filter="all"]'),
        prior1: document.querySelector('[data-prior-filter="first"]'),
        prior2: document.querySelector('[data-prior-filter="second"]'),
        prior3: document.querySelector('[data-prior-filter="third"]')
    };
    
    filterButtons.all.innerHTML = SVG_Icons.list;
    filterButtons.checked.innerHTML = SVG_Icons.circleCheck;
    filterButtons.unchecked.innerHTML = SVG_Icons.circle;
    filterButtons.dueAll.innerHTML = SVG_Icons.circle;
    filterButtons.dueSoon.innerHTML = SVG_Icons.square;
    filterButtons.overdue.innerHTML = SVG_Icons.triangle;
    filterButtons.priorAll.innerHTML = SVG_Icons.list;
    filterButtons.prior1.innerHTML = SVG_Icons.prio1;
    filterButtons.prior2.innerHTML = SVG_Icons.prio2;
    filterButtons.prior3.innerHTML = SVG_Icons.prio3;
}

const SVG_Icons = {
    check: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-icon lucide-check"><path d="M20 6 9 17l-5-5"/></svg>',
    trash: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
    list: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 5h.01"/><path d="M3 12h.01"/><path d="M3 19h.01"/><path d="M8 5h13"/><path d="M8 12h13"/><path d="M8 19h13"/></svg>',
    circleCheck: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>',
    circle: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>',
    prio1: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-tally1-icon lucide-tally-1"><path d="M4 4v16"/></svg>',
    prio2: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-tally2-icon lucide-tally-2"><path d="M4 4v16"/><path d="M9 4v16"/></svg>',
    prio3: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-tally3-icon lucide-tally-3"><path d="M4 4v16"/><path d="M9 4v16"/><path d="M14 4v16"/></svg>',
    square: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-icon lucide-square"><rect width="18" height="18" x="3" y="3" rx="2"/></svg>',
    triangle: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-triangle-icon lucide-triangle"><path d="M13.73 4a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/></svg>'
};

function checkTaskDeadlines(task) {
    const now = new Date();
    const taskDate = new Date(`${task.date}T${task.time}`);
    
    // Просроченные (раньше текущего времени)
    const isOverdue = taskDate < now;
    
    // Скоро дедлайн (в течение 24 часов)
    const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const isDueSoon = taskDate > now && taskDate <= in24Hours;
    
    return { isOverdue, isDueSoon };
}

// Функция для проверки просроченных задач
function isOverdue(task) {
    if (task.completed) return false; // Завершенные задачи не считаем просроченными
    
    const now = new Date();
    const taskDateTime = new Date(`${task.date}T${task.time}`);
    return taskDateTime < now;
}

// Функция для проверки "скоро дедлайн" (сегодня/завтра)
function isDueSoon(task) {
    if (task.completed) return false; // Завершенные задачи не показываем
    
    const now = new Date();
    const taskDateTime = new Date(`${task.date}T${task.time}`);
    
    // Задачи на сегодня и завтра
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Сравниваем только даты (без времени)
    const taskDate = new Date(task.date);
    const todayDate = new Date(now.toDateString());
    const tomorrowDate = new Date(tomorrow.toDateString());
    
    return taskDate.getTime() === todayDate.getTime() || 
           taskDate.getTime() === tomorrowDate.getTime();
}

// Отображение задач
export function renderTasks(tasks, filter, dueFilter, prioFilter, onToggle, onDelete, onEdit, onStartEdit, onSelectTask) {
    // Очищаем список перед рендерингом
    taskList.innerHTML = '';

    let tasksToShowFirstFilter = [];
    let tasksToShowSecondFilter = [];
    let tasksToShowThirdFilter = [];
    switch(filter) {
        case 'all':
            tasksToShowFirstFilter = tasks;
            break;
        case 'checked':
            tasksToShowFirstFilter = tasks.filter(task => task.completed);
            break;
        case 'unchecked':
            tasksToShowFirstFilter = tasks.filter(task => !task.completed);;
            break;
    }

    switch(dueFilter) {
        case 'all':
            tasksToShowSecondFilter = tasksToShowFirstFilter;
            break;
        case 'due-soon':
            // Задачи на сегодня/завтра
            tasksToShowSecondFilter = tasksToShowFirstFilter.filter(task => isDueSoon(task));
            break;
        case 'overdue':
            // Просроченные задачи
            tasksToShowSecondFilter = tasksToShowFirstFilter.filter(task => isOverdue(task));
            break;
    }

    switch(prioFilter) {
        case 'all':
            tasksToShowThirdFilter = tasksToShowSecondFilter;
            break;
        case 'first':
            tasksToShowThirdFilter = tasksToShowSecondFilter.filter(task => task.prio === 'first');
            break;
        case 'second':
            tasksToShowThirdFilter = tasksToShowSecondFilter.filter(task => task.prio === 'second');
            break;
        case 'third':
            tasksToShowThirdFilter = tasksToShowSecondFilter.filter(task => task.prio === 'third');
            break;

    }

    // Создаем элементы для каждой задачи
    tasksToShowThirdFilter.forEach((task, index) => {
        const newItem = document.createElement('li');
        const { isOverdue, isDueSoon } = checkTaskDeadlines(task);

        const taskContent = document.createElement('div');
        taskContent.className = 'task-content';

        const taskActions = document.createElement('div'); 
        taskActions.className = 'task-actions';

        if (isOverdue) {
            newItem.classList.add('overdue');
        } else if (isDueSoon) {
            newItem.classList.add('due-soon');
        }
        
        const taskText = document.createElement('span');
        taskText.textContent = task.title;  
        
        // Дата и время задачи
        const taskDateBlock = document.createElement('span');
        taskDateBlock.textContent = task.date + ' ' + task.time;

        // Приоритет
        const taskPrio = document.createElement('span');
        switch(task.prio) {
            case 'first':
                taskPrio.innerHTML = SVG_Icons.prio1;
                taskText.className = 'task-prio-first'; 
                taskDateBlock.className = 'date-prio-first';
                break;
            case 'second':
                taskPrio.innerHTML = SVG_Icons.prio2;
                taskText.className = 'task-prio-second'; 
                taskDateBlock.className = 'date-prio-second';
                break;
            case 'third':
                taskPrio.innerHTML = SVG_Icons.prio3;
                taskText.className = 'task-prio-third'; 
                taskDateBlock.className = 'date-prio-third';
                break;
        }
        taskPrio.className = 'task-prio';
        
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
        
        taskContent.appendChild(taskPrio);
        taskContent.appendChild(taskText);
        taskContent.appendChild(taskDateBlock);
        
        taskActions.appendChild(completeBtn);
        taskActions.appendChild(deleteBtn);
        
        newItem.appendChild(taskContent);
        newItem.appendChild(taskActions);

        // Редактирование
        newItem.addEventListener('click', (e) => {
            // Проверяем что кликнули не по кнопкам
            if (e.target !== completeBtn && e.target !== deleteBtn) {
                State.startEditing(task.id);
                openTaskModal(e, task);
            }
        });

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

// Модальное окно
function closeAllModals() {
    // Закрываем все модальные окна
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.classList.remove('active');
    });
    
    // Закрываем overlay
    const overlay = document.querySelector('#overlay-modal');
    if (overlay) {
        overlay.classList.remove('active');
    }
}

// Функция валидации одного поля
function validateField(field) {
    const parent = field.parentElement;
    const errorMessage = parent.querySelector('.error-message');
    
    if (field.hasAttribute('required') && !field.value.trim()) {
        field.classList.add('error');
        if (errorMessage) {
            errorMessage.classList.add('show');
        }
        return false;
    } else {
        field.classList.remove('error');
        if (errorMessage) {
            errorMessage.classList.remove('show');
        }
        return true;
    }
}

// Валидация всей формы
function validateForm() {
    const fields = document.querySelectorAll('#task-title, #task-date, #task-time');
    let isValid = true;
    
    fields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Валидация всей формы для редактирования
function validateFormEdit() {
    const fields = document.querySelectorAll('#task-title-edit, #task-date-edit, #task-time-edit');
    let isValid = true;
    
    fields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Обработчики событий для полей
function setupFormValidation() {
    const fields = document.querySelectorAll('#task-title, #task-description, #task-date');
    
    fields.forEach(field => {
        // Валидация при уходе с поля (blur)
        field.addEventListener('blur', function() {
            validateField(this);
        });
        
        // Убираем ошибку при начале ввода
        field.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                this.classList.remove('error');
                const errorMessage = this.nextElementSibling;
                if (errorMessage && errorMessage.classList.contains('error-message')) {
                    errorMessage.classList.remove('show');
                }
            }
        });
    });
}

// Инициализация при открытии модалки
function initModalForm() {
    // Установка минимальной даты
    const today = new Date().toISOString().split('T')[0];
    const dateField = document.getElementById('task-date');
    if (dateField) {
        dateField.min = today;
    }
    
    setupFormValidation();
    
    // Обработчик для кнопки СОЗДАНИЯ задачи в модалке
    const createTaskBtn = document.querySelector('#create-task-btn');
    if (createTaskBtn) {
        createTaskBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (validateForm()) {
                const formData = getFormData();
                console.log('Данные формы:', formData);
                // ... создание задачи ...
                State.addTask(formData);
                closeAllModals();

                window.dispatchEvent(new CustomEvent('taskUpdated'));
            } else {
                alert('Пожалуйста, заполните обязательные поля');
            }
        });
    }
    
    // Сброс формы при открытии
    document.querySelector('.input-modal').addEventListener('click', function() {
        // Сбрасываем приоритет на первый в модалке создания
        const prioButtons = document.querySelectorAll('.prio-btn-edit');
        prioButtons.forEach((btn, index) => {
            btn.classList.toggle('active', index === 0);
        });
    });
}

function initAllPrioButtons() {
    // Все кнопки приоритета (и создание и редактирование)
    const allPrioButtons = document.querySelectorAll('.prio-btn, .prio-btn-edit');
    
    allPrioButtons.forEach(btn => {
        const prioType = btn.getAttribute('prio');
        
        switch(prioType) {
            case 'first':
                btn.innerHTML = SVG_Icons.prio1;
                break;
            case 'second':
                btn.innerHTML = SVG_Icons.prio2;
                break;
            case 'third':
                btn.innerHTML = SVG_Icons.prio3;
                break;
        }
    });
    
    console.log('Инициализировано кнопок приоритета:', allPrioButtons.length);
}

function openTaskModal(e, task) {
    console.log('openTaskModal вызван для задачи:', task);
    const modalElem = document.querySelector('.modal[data-modal="2"]');
    const overlay = document.querySelector('#overlay-modal');

    // Заполняем поля формы данными задачи
    const editTitle = document.getElementById('task-title-edit');
    const editDescription = document.getElementById('task-description-edit');
    const editDate = document.getElementById('task-date-edit');
    const editTime = document.getElementById('task-time-edit');

    if (editTitle) editTitle.value = task.title || '';
    if (editDescription) editDescription.value = task.description || '';
    if (editDate) editDate.value = task.date || '';
    if (editTime) editTime.value = task.time || '';

    // Сохраняем ID редактируемой задачи в data-атрибут модалки
    if (modalElem) {
        modalElem.setAttribute('data-editing-task-id', task.id);
    }

    if (modalElem && overlay) {
        modalElem.classList.add('active');
        overlay.classList.add('active');
    }
}

function handleEditTask(e) {
    e.preventDefault();
    console.log('Кнопка редактирования нажата');
    
    const modalElem = document.querySelector('.modal[data-modal="2"]');
    const taskId = modalElem ? modalElem.getAttribute('data-editing-task-id') : null;
    
    if (!taskId) {
        console.error('ID задачи не найден');
        return;
    }

    if (validateFormEdit()) {
        const formData = getFormDataEdit();
        console.log('Данные для редактирования:', formData, 'ID:', taskId);
        
        State.editTask(formData, taskId);
        closeAllModals();
        
        window.dispatchEvent(new CustomEvent('taskUpdated'));
    } else {
        alert('Пожалуйста, заполните обязательные поля');
    }
}

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

    // Обработчик кнопок приоритетов
    if (e.target.closest('.prio-btn')) {
        e.preventDefault();
        e.stopPropagation(); // ← ВАЖНО: останавливаем всплытие
        
        const clickedBtn = e.target.closest('.prio-btn');
        const allPrioBtns = document.querySelectorAll('.prio-btn');
        
        // Снимаем active со всех кнопок
        allPrioBtns.forEach(btn => btn.classList.remove('active'));
        // Добавляем active к нажатой кнопке
        clickedBtn.classList.add('active');
        
        return; // ← останавливаем дальнейшую обработку
    }
    
    // Закрытие модалки по клику на крестик
    if (e.target.closest('.modal-cross')) {
        closeAllModals();
    }
    
    // Закрытие модалки по клику на overlay
    if (e.target.id === 'overlay-modal') {
        closeAllModals();
    }
});

function setupEditPrioButtons() {
    const editPrioButtons = document.querySelectorAll('.prio-btn-edit');
    
    editPrioButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('Кнопка приоритета редактирования нажата:', this.getAttribute('prio'));
            
            // Снимаем active со всех кнопок приоритета в ЭТОЙ модалке
            editPrioButtons.forEach(b => b.classList.remove('active'));
            // Добавляем active к нажатой кнопке
            this.classList.add('active');
        });
    });
}

document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape') {
        closeAllModals();
    }
});

document.addEventListener('DOMContentLoaded', function() {
    initFilterButtons();
    initAllPrioButtons();
    initModalForm();
    setupEditPrioButtons();
    
    const editTaskBtn = document.getElementById('edit-task-btn');
    if (editTaskBtn) {
        editTaskBtn.addEventListener('click', handleEditTask);
    }
});