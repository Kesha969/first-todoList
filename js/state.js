import * as Storage from './storage.js';

let tasks = [];
let currentFilter = 'all';

// Инициализация
export function initState() {
    tasks = Storage.loadTasks();
    currentFilter = Storage.loadFilter();
    return { tasks, currentFilter };
}

// Экспорт переменных
export function getTasks() { return tasks; }
export function getCurrentFilter() { return currentFilter; }

// Добавление задачи
export function addTask(text) {
    const newTask = {
        id: crypto.randomUUID(),
        text: text.trim(),
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

export function editTask(id, newText) {
    const task = tasks.find(task => task.id === id);
    if (task && newText.trim()) {
        task.text = newText.trim();
        Storage.saveTasks(tasks);
        return true;
    }
    return false;
}

// Установка фильтра
export function setFilter(filter) {
    currentFilter = filter;
    Storage.saveFilter(filter);
}

// Текущая задача
export function setCurrentTask(task) {
    Storage.currentTask = task;
    View.checkActiveTask = true;
}