/**
 * LifeOS Storage & State Management
 * Синхронизация данных с LocalStorage и управление состоянием
 */

const STORAGE_KEY = 'lifeos_app_data_v2';
const THEME_KEY = 'lifeos_theme_mode';
const SOUND_KEY = 'lifeos_sound_enabled';

class StorageManager {
  constructor() {
    this.data = this.loadData();
  }

  loadData() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Ошибка чтения из localStorage, используем исходные данные:', e);
    }
    // Глубокое клонирование дефолтных данных
    return JSON.parse(JSON.stringify(DEFAULT_LIFEOS_DATA));
  }

  saveData() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.error('Ошибка записи в localStorage:', e);
    }
  }

  resetToDefault() {
    this.data = JSON.parse(JSON.stringify(DEFAULT_LIFEOS_DATA));
    this.saveData();
    return this.data;
  }

  /* --- Тема оформления --- */
  getTheme() {
    return localStorage.getItem(THEME_KEY) || 'dark';
  }

  setTheme(theme) {
    localStorage.setItem(THEME_KEY, theme);
    document.documentElement.setAttribute('data-theme', theme);
  }

  /* --- Звуковые эффекты --- */
  getSoundEnabled() {
    const val = localStorage.getItem(SOUND_KEY);
    return val === null ? true : val === 'true';
  }

  setSoundEnabled(val) {
    localStorage.setItem(SOUND_KEY, String(val));
  }

  /* --- События расписания --- */
  getSchedule() {
    return this.data.schedule || [];
  }

  addScheduleEvent(event) {
    if (!event.id) event.id = 'ev-' + Date.now();
    this.data.schedule.push(event);
    this.saveData();
    return event;
  }

  updateScheduleEvent(updatedEvent) {
    const index = this.data.schedule.findIndex(e => e.id === updatedEvent.id);
    if (index !== -1) {
      this.data.schedule[index] = updatedEvent;
      this.saveData();
      return true;
    }
    return false;
  }

  deleteScheduleEvent(id) {
    this.data.schedule = this.data.schedule.filter(e => e.id !== id);
    this.saveData();
  }

  /* --- Задачи --- */
  getTasks() {
    return this.data.tasks || [];
  }

  addTask(task) {
    if (!task.id) task.id = 'task-' + Date.now();
    if (task.completed === undefined) task.completed = false;
    this.data.tasks.unshift(task);
    this.saveData();
    return task;
  }

  toggleTask(id) {
    const task = this.data.tasks.find(t => t.id === id);
    if (task) {
      task.completed = !task.completed;
      this.saveData();
      return task;
    }
    return null;
  }

  deleteTask(id) {
    this.data.tasks = this.data.tasks.filter(t => t.id !== id);
    this.saveData();
  }

  /* --- Цели --- */
  getGoals() {
    return this.data.goals || [];
  }

  addGoal(goal) {
    if (!goal.id) goal.id = 'goal-' + Date.now();
    this.data.goals.push(goal);
    this.saveData();
    return goal;
  }

  toggleMilestone(goalId, milestoneId) {
    const goal = this.data.goals.find(g => g.id === goalId);
    if (goal && goal.milestones) {
      const ms = goal.milestones.find(m => m.id === milestoneId);
      if (ms) {
        ms.done = !ms.done;
        this.saveData();
        return ms;
      }
    }
    return null;
  }

  deleteGoal(id) {
    this.data.goals = this.data.goals.filter(g => g.id !== id);
    this.saveData();
  }

  /* --- Привычки --- */
  getHabits() {
    return this.data.habits || [];
  }

  addHabit(habit) {
    if (!habit.id) habit.id = 'hab-' + Date.now();
    if (!habit.history) habit.history = { mon: false, tue: false, wed: false, thu: false, fri: false, sat: false, sun: false };
    if (!habit.streak) habit.streak = 1;
    this.data.habits.push(habit);
    this.saveData();
    return habit;
  }

  toggleHabitDay(habitId, dayKey) {
    const habit = this.data.habits.find(h => h.id === habitId);
    if (habit) {
      if (!habit.history) habit.history = {};
      habit.history[dayKey] = !habit.history[dayKey];
      
      // Пересчёт серии (streak)
      let completedDays = 0;
      const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
      days.forEach(d => {
        if (habit.history[d]) completedDays++;
      });
      habit.streak = Math.max(1, completedDays * 2 + 1);

      this.saveData();
      return habit;
    }
    return null;
  }

  deleteHabit(id) {
    this.data.habits = this.data.habits.filter(h => h.id !== id);
    this.saveData();
  }
}

// Экземпляр синглтона хранилища
const lifeStorage = new StorageManager();
