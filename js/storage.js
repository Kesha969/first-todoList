// Сохранение переменных в localStorage
export function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Загрузка переменных из localStorage
export function loadTasks() {
    try {
        const stored = localStorage.getItem('tasks');
        return stored ? JSON.parse(stored) : [];
    } catch (err) {
        console.error('Ошибка загрузки задач:', err);
        return [];
    }
}

// Сохранение фильтра в localStorage
export function saveFilter(filter) {
    localStorage.setItem('filter', filter);
}

// Загрузка фильтра из localStorage
export function loadFilter() {
    return localStorage.getItem('filter') || 'all';
}