import * as State from './state.js';
import * as View from './view.js';

console.log('main.js загружен'); // ← добавить
console.log('State:', State);    // ← добавить
console.log('View:', View);      // ← добавить

function onToggle(taskId) {
    State.toggleTaskCompletion(taskId);
    refreshView();
}

function onDelete(taskId) {
    State.deleteTask(taskId);
    refreshView();
}

function onStartEdit(taskId) {
    console.log('onStartEdit вызван с ID:', taskId);
    State.startEditing(taskId);
    refreshView();
}

function onEdit(taskId, newText) {
    if (newText !== undefined && newText.trim() !== '') {
        State.editTask(taskId, newText);
    }
    State.stopEditing(); // ← всегда завершаем редактирование
    refreshView();
}

function onSelectTask(taskId) {
    State.selectTask(taskId);
    refreshView();
    // Здесь потом откроем окно с информацией
}

function refreshView() {
    console.log('refreshView вызван');
    View.renderTasks(
        State.getTasks(), 
        State.getCurrentFilter(), 
        onToggle, 
        onDelete,
        onEdit,
        onStartEdit,
        onSelectTask
    );
    View.updateCounter(State.getTasks());
}

// Инициализация приложения
function initApp() {
    const state = State.initState();
    refreshView();
    setupEventListeners();
    
    // Устанавливаем активную кнопку фильтра
    const currentFilter = State.getCurrentFilter();
    const activeBtn = document.querySelector(`[data-filter="${currentFilter}"]`);
    if (activeBtn) {
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        activeBtn.classList.add('active');
    }
}

function setupEventListeners() {
    
    // Обработчик фильтра
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const filter = e.currentTarget.dataset.filter;
            State.setFilter(filter);
            refreshView();
            
            // Обновляем активную кнопку
            filterButtons.forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
        });
    });
}

// Запускаем приложение когда DOM загружен
document.addEventListener('DOMContentLoaded', initApp);