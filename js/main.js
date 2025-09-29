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

function refreshView() {
    console.log('refreshView вызван');
    View.renderTasks(
        State.getTasks(), 
        State.getCurrentFilter(), 
        onToggle, 
        onDelete
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