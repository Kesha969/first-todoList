import * as State from "./state.js";

// Получаем DOM элементы
const addButton = document.querySelector('#add-button');
const taskList = document.querySelector('#task-list');
const taskCounter = document.querySelector('#task-counter');
const overlay = document.querySelector('#overlay-modal');
const inputModal = document.querySelector('#input-modal');
const closeModal = document.querySelectorAll('.modal-cross');

function getFormData() {
    const titleField = document.getElementById('task-title');
    const descField = document.getElementById('task-description');
    const dateField = document.getElementById('task-date');
    const timeField = document.getElementById('task-time');
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
        priority: activePrio.getAttribute('prio')
    };
}

function getFormDataEdit() {
    console.log("=== getFormDataEdit вызван ===");
    
    // Поиск элементов формы редактирования
    const titleField = document.querySelector('#task-title-edit');
    const descriptionField = document.querySelector('#task-description-edit');
    const dateField = document.querySelector('#task-date-edit');
    const timeField = document.querySelector('#task-time-edit');
    
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
        time: timeField.value
    };
    
    console.log("✅ Form data collected:", formData);
    return formData;
}

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
    circle: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>',
    prio1: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-tally1-icon lucide-tally-1"><path d="M4 4v16"/></svg>',
    prio2: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-tally2-icon lucide-tally-2"><path d="M4 4v16"/><path d="M9 4v16"/></svg>',
    prio3: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-tally3-icon lucide-tally-3"><path d="M4 4v16"/><path d="M9 4v16"/><path d="M14 4v16"/></svg>'
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
            input.value = task.title;
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
            taskText.textContent = task.title;  
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
                    State.startEditing(task.id);
                    openTaskModal(e, task);
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
            } else {
                alert('Пожалуйста, заполните обязательные поля');
            }
        });
    }
    
    // Сброс формы при открытии
    document.querySelector('.input-modal').addEventListener('click', function() {
        // Сбрасываем форму
        const form = document.querySelector('.modal-form');
        if (form) form.reset();
        
        // Сбрасываем ошибки
        document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
        document.querySelectorAll('.error-message.show').forEach(el => el.classList.remove('show'));
        
        // Сбрасываем приоритет на первый
        const prioButtons = document.querySelectorAll('.prio-btn');
        prioButtons.forEach((btn, index) => {
            btn.classList.toggle('active', index === 0);
        });
    });
}

function initPrioButtons() {
    const prioButtons = {
        first: document.querySelector('[prio="first"]'),
        second: document.querySelector('[prio="second"]'),
        third: document.querySelector('[prio="third"]')
    };
    
    prioButtons.first.innerHTML = SVG_Icons.prio1;
    prioButtons.second.innerHTML = SVG_Icons.prio2;
    prioButtons.third.innerHTML = SVG_Icons.prio3;
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

    // Устанавливаем активный приоритет
    const prioButtons = document.querySelectorAll('.prio-btn-edit');
    prioButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('prio') === task.prio) {
            btn.classList.add('active');
        }
    });

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
        
        // Вызываем колбэк onEdit из main.js
        // Нужно найти способ вызвать onEdit из main.js
        // Временное решение - обновим State напрямую
        State.editTask(formData, taskId);
        closeAllModals();
        
        // Нужно вызвать refreshView() - пока сделаем перезагрузку
        location.reload(); // Временное решение
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

document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape') {
        closeAllModals();
    }
});

document.addEventListener('DOMContentLoaded', function() {
    initFilterButtons();
    initPrioButtons();
    initModalForm();
    
    const editTaskBtn = document.getElementById('edit-task-btn');
    if (editTaskBtn) {
        editTaskBtn.addEventListener('click', handleEditTask);
    }
});