import * as Storage from './storage.js';

let tasks = [];
let currentFilter = 'all';
let currentDueFilter = 'all';
let editingTaskId = null;
let selectedTaskId = null;

// Инициализация
export function initState() {
    tasks = Storage.loadTasks();
    currentFilter = Storage.loadFilter();
    currentDueFilter = Storage.loadDueFilter();
    return { tasks, currentFilter, currentDueFilter };
}

// Экспорт переменных
export function getTasks() { return tasks; }
export function getCurrentFilter() { return currentFilter; }
export function getCurrentDueFilter() { return currentDueFilter; }

// Добавление задачи
export function addTask(formData) {
    const newTask = {
        id: crypto.randomUUID(),
        title: formData.title.trim(),
        description: formData.description.trim(),
        date: formData.date.trim(),
        time: formData.time.trim(),
        prio: formData.prio,
        completed: false
        
    };
    tasks.unshift(newTask);
    Storage.saveTasks(tasks);
}

// Удаление задачи
export function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    Storage.saveTasks(tasks);
}

// Переключение состояния выполнения
export function toggleTaskCompletion(id) {
    const task = tasks.find(task => task.id === id);
    if (task) {
        task.completed = !task.completed;
        Storage.saveTasks(tasks);
    }
}

export function editTask(newTaskData, id) {
    const task = tasks.find(task => task.id === id);
    console.log('Редактируем задачу:', task, 'новые данные:', newTaskData);
    
    if (task) {
        task.title = newTaskData.title.trim();
        task.description = newTaskData.description.trim();
        task.date = newTaskData.date.trim();
        task.time = newTaskData.time.trim();
        task.prio = newTaskData.prio;
        Storage.saveTasks(tasks);
        console.log('Задача обновлена:', task);
        return true;
    }
    console.error('Задача не найдена для редактирования');
    return false;
}

// Установка фильтра
export function setFilter(filter) {
    currentFilter = filter;
    Storage.saveFilter(filter);
}

export function setDueFilter(dueFilter) {
    currentDueFilter = dueFilter;
    Storage.saveDueFilter(dueFilter);
}

// Текущая задача
export function setCurrentTask(id) {
    Storage.currentTaskId = id;
    View.checkActiveTask = true;
}

export function startEditing(taskId) {
    editingTaskId = taskId;
    selectedTaskId = null;
}

export function stopEditing() {
    editingTaskId = null;
}

export function selectTask(taskId) {
    selectedTaskId = taskId;
    editingTaskId = null;
}

export function getEditingTaskId() {
    return editingTaskId;
}

export function getSelectedTaskId() {
    return selectedTaskId;
}