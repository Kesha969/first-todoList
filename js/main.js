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

function onEdit(taskData, taskId) {
    State.editTask(taskData, taskId);
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
        State.getCurrentDueFilter(),
        State.getCurrentPrioFilter(),
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

    // Устанавливаем активную кнопку просроченности фильтра
    const currentDueFilter = State.getCurrentDueFilter();
    const activeDueBtn = document.querySelector(`[data-due-filter="${currentDueFilter}"]`);
    if (activeDueBtn) {
        document.querySelectorAll('.due-btn').forEach(btn => btn.classList.remove('active'));
        activeDueBtn.classList.add('active');
    }

    const currentPrioFilter = State.getCurrentPrioFilter();
    const activePrioBtn = document.querySelector(`[data-prior-filter="${currentPrioFilter}"]`);
    if(activePrioBtn) {
        document.querySelectorAll('.prior-btn').forEach(btn => btn.classList.remove('active'));
        activePrioBtn.classList.add('active');
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
    
    const dueFilterButtons = document.querySelectorAll('.due-btn');
    dueFilterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const dueFilter = e.currentTarget.dataset.dueFilter;
            State.setDueFilter(dueFilter);
            refreshView();

            dueFilterButtons.forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
        })
    });

    const prioFilterButtons = document.querySelectorAll('.prior-btn');
    prioFilterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const prioFilter = e.currentTarget.dataset.priorFilter;
            State.setPrioFilter(prioFilter);
            console.log('prio filter: ', prioFilter);
            refreshView();

            prioFilterButtons.forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
        })
    })
}

window.addEventListener('taskUpdated', function() {
    refreshView();
});

// Запускаем приложение когда DOM загружен
document.addEventListener('DOMContentLoaded', initApp);