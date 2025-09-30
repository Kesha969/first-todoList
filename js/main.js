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
}

function setupEventListeners() {
    const { addButton, taskInput, filterSelect } = View.getDOMElements();
    
    // Обработчик добавления задачи
    addButton.addEventListener('click', () => {
        const text = taskInput.value;
        if (text.trim()) {
            State.addTask(text);
            refreshView();
            View.clearInput();
        }
    });
    
    // Обработчик фильтра
    filterSelect.addEventListener('change', (e) => {
        State.setFilter(e.target.value);
        refreshView();
    });
    
    // Enter для добавления
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addButton.click();
        }
    });
}

// Запускаем приложение когда DOM загружен
document.addEventListener('DOMContentLoaded', initApp);