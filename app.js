/**
 * LifeOS Main Application Controller
 * Маршрутизация вкладок, рендеринг представлений, обработчики событий
 */

class LifeOSApp {
  constructor() {
    this.currentTab = 'dashboard';
    this.selectedScheduleDay = 'mon'; // По умолчанию понедельник
    this.selectedScheduleCategory = 'all';
    this.selectedTaskStatus = 'all';
    this.selectedTaskPriority = 'all';

    this.init();
  }

  init() {
    // 1. Инициализация темы и звука
    const savedTheme = lifeStorage.getTheme();
    lifeStorage.setTheme(savedTheme);
    this.updateSoundButtonUI();

    // 2. Инициализация часов и даты
    this.startClock();

    // 3. Инициализация модалок и конфетти
    Modal.initListeners();
    Confetti.init();

    // 4. Привязка навигации и глобальных событий
    this.bindNavigation();
    this.bindGlobalActions();
    this.bindScheduleActions();
    this.bindTasksActions();
    this.bindGoalsActions();
    this.bindHabitsActions();

    // 5. Первичный рендеринг всех представлений
    this.renderAll();
  }

  /* ==========================================================================
     ЧАСЫ, ДАТА И СТАТУС БАР
     ========================================================================== */

  startClock() {
    const updateTime = () => {
      const now = new Date();
      const clockEl = document.getElementById('liveClock');
      const dateEl = document.getElementById('liveDate');

      if (clockEl) {
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        clockEl.textContent = `${hours}:${minutes}`;
      }

      if (dateEl) {
        const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
        const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
        dateEl.textContent = `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]}`;
      }
    };

    updateTime();
    setInterval(updateTime, 1000);
  }

  updateSoundButtonUI() {
    const btn = document.getElementById('soundToggleBtn');
    if (btn) {
      const isEnabled = lifeSound.enabled;
      btn.style.opacity = isEnabled ? '1' : '0.4';
      btn.title = isEnabled ? 'Звуковые эффекты: Включены' : 'Звуковые эффекты: Выключены';
    }
  }

  /* ==========================================================================
     НАВИГАЦИЯ И ВКЛАДКИ
     ========================================================================== */

  bindNavigation() {
    const navItems = document.querySelectorAll('.nav-item[data-tab]');
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        const tab = item.getAttribute('data-tab');
        this.switchTab(tab);
        lifeSound.playClick();
      });
    });

    // Мобильное меню
    const openBtn = document.getElementById('sidebarOpenBtn');
    const closeBtn = document.getElementById('sidebarCloseBtn');
    const sidebar = document.getElementById('sidebar');

    if (openBtn && sidebar) {
      openBtn.addEventListener('click', () => {
        sidebar.classList.add('mobile-open');
        lifeSound.playClick();
      });
    }

    if (closeBtn && sidebar) {
      closeBtn.addEventListener('click', () => {
        sidebar.classList.remove('mobile-open');
      });
    }

    // Быстрые переходы с дашборда
    const btnGoToSchedule = document.getElementById('btnGoToSchedule');
    if (btnGoToSchedule) {
      btnGoToSchedule.addEventListener('click', () => this.switchTab('schedule'));
    }

    const btnGoToGoals = document.getElementById('btnGoToGoals');
    if (btnGoToGoals) {
      btnGoToGoals.addEventListener('click', () => this.switchTab('goals'));
    }

    // Быстрые кнопки-чипы в карточке дашборда
    document.getElementById('heroBtnSchedule')?.addEventListener('click', () => this.switchTab('schedule'));
    document.getElementById('heroBtnTasks')?.addEventListener('click', () => this.switchTab('tasks'));
    document.getElementById('heroBtnHabits')?.addEventListener('click', () => this.switchTab('habits'));
    document.getElementById('heroBtnGoals')?.addEventListener('click', () => this.switchTab('goals'));
  }

  switchTab(tabName) {
    this.currentTab = tabName;

    // Переключение кнопок навигации
    document.querySelectorAll('.nav-item').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tabName);
    });

    // Переключение секций
    document.querySelectorAll('.tab-pane').forEach(pane => {
      pane.classList.remove('active');
    });

    const activePane = document.getElementById(`tab-${tabName}`);
    if (activePane) {
      activePane.classList.add('active');
    }

    // Закрываем мобильный сайдбар при клике
    const sidebar = document.getElementById('sidebar');
    if (sidebar && sidebar.classList.contains('mobile-open')) {
      sidebar.classList.remove('mobile-open');
    }

    // Обновляем специфичные для вкладки данные
    if (tabName === 'analytics') {
      this.renderAnalytics();
    } else if (tabName === 'schedule') {
      this.renderSchedule();
    } else if (tabName === 'dashboard') {
      this.renderDashboard();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ==========================================================================
     ГЛОБАЛЬНЫЕ ДЕЙСТВИЯ (ТЕМА, ПОИСК, БЫСТРЫЕ КНОПКИ)
     ========================================================================== */

  bindGlobalActions() {
    // Тема (Светлая / Тёмная)
    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const current = lifeStorage.getTheme();
        const next = current === 'dark' ? 'light' : 'dark';
        lifeStorage.setTheme(next);
        lifeSound.playClick();
        Toast.show(`Включена ${next === 'dark' ? 'тёмная' : 'светлая'} тема`, 'info');
      });
    }

    // Звук
    const soundBtn = document.getElementById('soundToggleBtn');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        const enabled = lifeSound.toggleSound();
        this.updateSoundButtonUI();
        Toast.show(enabled ? 'Звуковые эффекты включены 🔔' : 'Звук отключен 🔕', 'info');
      });
    }

    // Сброс к исходным демо-данным
    const resetBtn = document.getElementById('resetDemoBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('Сбросить все изменения и восстановить начальные демо-данные LifeOS?')) {
          lifeStorage.resetToDefault();
          this.renderAll();
          lifeSound.playSuccess();
          Toast.show('Данные сброшены к исходным!', 'success');
        }
      });
    }

    // Кнопка быстрого действия в сайдбаре и в шапке
    const quickAddBtn = document.getElementById('quickAddBtn');
    const topQuickAddBtn = document.getElementById('btnTopQuickAdd');
    const openQuickModal = () => Modal.open('quickAddModal');

    if (quickAddBtn) quickAddBtn.addEventListener('click', openQuickModal);
    if (topQuickAddBtn) topQuickAddBtn.addEventListener('click', openQuickModal);

    // Быстрые карточки внутри модалки
    document.getElementById('qaNewEventBtn')?.addEventListener('click', () => {
      Modal.close('quickAddModal');
      this.openAddEventModal();
    });

    document.getElementById('qaNewTaskBtn')?.addEventListener('click', () => {
      Modal.close('quickAddModal');
      this.openAddTaskModal();
    });

    document.getElementById('qaNewGoalBtn')?.addEventListener('click', () => {
      Modal.close('quickAddModal');
      const form = document.getElementById('addGoalForm');
      if (form) form.reset();
      Modal.open('addGoalModal');
    });

    document.getElementById('qaNewHabitBtn')?.addEventListener('click', () => {
      Modal.close('quickAddModal');
      const form = document.getElementById('addHabitForm');
      if (form) form.reset();
      Modal.open('addHabitModal');
    });

    // Глобальный поиск
    const searchInput = document.getElementById('globalSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        this.handleGlobalSearch(query);
      });
    }
  }

  handleGlobalSearch(query) {
    if (!query) {
      this.renderTasks();
      this.renderSchedule();
      return;
    }

    // Если ищут в таске задач
    const tasks = lifeStorage.getTasks();
    const filteredTasks = tasks.filter(t => t.title.toLowerCase().includes(query));
    this.renderTasksListFiltered(filteredTasks);
  }

  /* ==========================================================================
     РЕНДЕРИНГ ВСЕХ КОМПОНЕНТОВ
     ========================================================================== */

  renderAll() {
    this.updateBadges();
    this.renderDashboard();
    this.renderSchedule();
    this.renderTasks();
    this.renderGoals();
    this.renderHabits();
    this.renderAnalytics();
  }

  updateBadges() {
    const tasks = lifeStorage.getTasks();
    const pendingTasks = tasks.filter(t => !t.completed).length;

    const navTasksPending = document.getElementById('navTasksPending');
    if (navTasksPending) navTasksPending.textContent = pendingTasks;

    const habits = lifeStorage.getHabits();
    const maxStreak = habits.reduce((max, h) => Math.max(max, h.streak || 0), 0);
    const navStreakCount = document.getElementById('navStreakCount');
    if (navStreakCount) navStreakCount.textContent = maxStreak;
  }

  /* ==========================================================================
     1. ДАШБОРД (ГЛАВНАЯ)
     ========================================================================== */

  renderDashboard() {
    const schedule = lifeStorage.getSchedule();
    const habits = lifeStorage.getHabits();
    const tasks = lifeStorage.getTasks();

    // Расписание на понедельник (сегодня)
    const todayEvents = schedule.filter(e => e.day === 'mon');
    todayEvents.sort((a, b) => a.startTime.localeCompare(b.startTime));

    const timelineContainer = document.getElementById('dashboardTimeline');
    if (timelineContainer) {
      if (todayEvents.length === 0) {
        timelineContainer.innerHTML = `
          <div class="empty-state text-center py-4 text-muted">
            <p>На сегодня нет запланированных событий.</p>
            <button class="btn btn-sm btn-outline mt-2" onclick="app.openAddEventModal('mon')">+ Добавить занятие</button>
          </div>
        `;
      } else {
        timelineContainer.innerHTML = todayEvents.map(event => {
          const categoryNames = {
            study: '📘 Учёба',
            sport: '🏃 Спорт',
            work: '💼 Работа',
            rest: '☕ Отдых',
            other: '🌟 Личное'
          };
          const isDone = event.completed ? 'opacity-75' : '';
          return `
            <div class="timeline-event-item ${isDone}">
              <div class="event-time-col">
                <span>${event.startTime} - ${event.endTime}</span>
                <span class="event-duration">${this.calculateDuration(event.startTime, event.endTime)}</span>
              </div>
              <div class="event-info-col">
                <div class="event-title">${this.escapeHtml(event.title)}</div>
                <div class="event-meta">
                  <span class="event-category-tag tag-${event.category}">${categoryNames[event.category] || event.category}</span>
                  ${event.notes ? `<span>• ${this.escapeHtml(event.notes)}</span>` : ''}
                </div>
              </div>
            </div>
          `;
        }).join('');
      }
    }

    // Привычки на сегодня (mon)
    const habitsList = document.getElementById('dashboardHabitsList');
    if (habitsList) {
      let doneCount = 0;
      habitsList.innerHTML = habits.map(h => {
        const isChecked = h.history && h.history.mon;
        if (isChecked) doneCount++;
        return `
          <div class="habit-quick-item" data-id="${h.id}">
            <div class="habit-quick-left">
              <button class="custom-checkbox ${isChecked ? 'checked' : ''}" data-action="toggle-habit" data-id="${h.id}">
                ${isChecked ? '✓' : ''}
              </button>
              <span class="habit-quick-icon">${h.icon || '🔥'}</span>
              <span class="habit-quick-title">${this.escapeHtml(h.title)}</span>
            </div>
            <span class="habit-quick-streak">🔥 ${h.streak} дн</span>
          </div>
        `;
      }).join('');

      const habitsDoneEl = document.getElementById('habitsTodayDoneCount');
      if (habitsDoneEl) {
        habitsDoneEl.textContent = `${doneCount} / ${habits.length} готово`;
      }
    }

    // Задачи в фокусе (топ-3 незавершенных с высоким приоритетом)
    const tasksList = document.getElementById('dashboardTasksList');
    if (tasksList) {
      const focusTasks = tasks.slice(0, 4);
      tasksList.innerHTML = focusTasks.map(t => {
        const priorityClass = t.priority === 'high' ? 'dot-high' : t.priority === 'medium' ? 'dot-medium' : 'dot-low';
        return `
          <div class="task-mini-item ${t.completed ? 'done' : ''}">
            <button class="custom-checkbox ${t.completed ? 'checked' : ''}" data-action="toggle-task" data-id="${t.id}">
              ${t.completed ? '✓' : ''}
            </button>
            <span class="task-priority-dot ${priorityClass}"></span>
            <span class="task-mini-title">${this.escapeHtml(t.title)}</span>
          </div>
        `;
      }).join('');
    }

    // Прогресс дня (рассчитываем общий процент выполненных задач и привычек)
    const totalItems = tasks.length + habits.length;
    const completedItems = tasks.filter(t => t.completed).length + habits.filter(h => h.history && h.history.mon).length;
    const percent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 70;

    const percentEl = document.getElementById('heroCompletedPercent');
    if (percentEl) percentEl.textContent = `${percent}%`;

    const circleEl = document.getElementById('heroProgressCircle');
    if (circleEl) {
      const radius = 54;
      const circumference = 2 * Math.PI * radius;
      const offset = circumference - (percent / 100) * circumference;
      circleEl.style.strokeDasharray = `${circumference} ${circumference}`;
      circleEl.style.strokeDashoffset = offset;
    }

    const topFocusScore = document.getElementById('topFocusScore');
    if (topFocusScore) topFocusScore.textContent = `${percent}%`;

    const heroTodayTasksCount = document.getElementById('heroTodayTasksCount');
    if (heroTodayTasksCount) heroTodayTasksCount.textContent = `${todayEvents.length} дела`;

    // Привязка кликов чекбоксов в дашборде
    timelineContainer?.querySelectorAll('[data-action="toggle-habit"]').forEach(btn => {
      btn.addEventListener('click', (e) => this.handleHabitToggle(e));
    });
    habitsList?.querySelectorAll('[data-action="toggle-habit"]').forEach(btn => {
      btn.addEventListener('click', (e) => this.handleHabitToggle(e));
    });
    tasksList?.querySelectorAll('[data-action="toggle-task"]').forEach(btn => {
      btn.addEventListener('click', (e) => this.handleTaskToggle(e));
    });

    const btnQuickAddTaskModal = document.getElementById('btnQuickAddTaskModal');
    if (btnQuickAddTaskModal) {
      btnQuickAddTaskModal.onclick = () => this.openAddTaskModal();
    }
  }

  /* ==========================================================================
     2. УМНОЕ РАСПИСАНИЕ (SCHEDULE)
     ========================================================================== */

  bindScheduleActions() {
    // Селектор дней недели
    const weekDaysSelector = document.getElementById('weekDaysSelector');
    if (weekDaysSelector) {
      const days = [
        { key: 'mon', name: 'Пн', date: '27' },
        { key: 'tue', name: 'Вт', date: '28' },
        { key: 'wed', name: 'Ср', date: '29' },
        { key: 'thu', name: 'Чт', date: '30' },
        { key: 'fri', name: 'Пт', date: '31' },
        { key: 'sat', name: 'Сб', date: '1' },
        { key: 'sun', name: 'Вс', date: '2' }
      ];

      weekDaysSelector.innerHTML = days.map(d => `
        <div class="day-pill ${d.key === this.selectedScheduleDay ? 'active' : ''}" data-day="${d.key}">
          <div class="day-name">${d.name}</div>
          <div class="day-date">${d.date}</div>
        </div>
      `).join('');

      weekDaysSelector.querySelectorAll('.day-pill').forEach(pill => {
        pill.addEventListener('click', () => {
          this.selectedScheduleDay = pill.getAttribute('data-day');
          weekDaysSelector.querySelectorAll('.day-pill').forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          this.renderSchedule();
          lifeSound.playClick();
        });
      });
    }

    // Фильтр категорий
    const categoryFilters = document.getElementById('scheduleCategoryFilters');
    if (categoryFilters) {
      categoryFilters.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          categoryFilters.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.selectedScheduleCategory = btn.getAttribute('data-category');
          this.renderSchedule();
          lifeSound.playClick();
        });
      });
    }

    // Кнопка добавления занятия
    const btnAddNewEvent = document.getElementById('btnAddNewEvent');
    if (btnAddNewEvent) {
      btnAddNewEvent.addEventListener('click', () => {
        this.openAddEventModal(this.selectedScheduleDay);
      });
    }

    // Форма сохранения занятия
    const addEventForm = document.getElementById('addEventForm');
    if (addEventForm) {
      addEventForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const editId = document.getElementById('eventEditId').value;
        const title = document.getElementById('eventTitle').value.trim();
        const category = document.getElementById('eventCategory').value;
        const day = document.getElementById('eventDay').value;
        const startTime = document.getElementById('eventStartTime').value;
        const endTime = document.getElementById('eventEndTime').value;
        const notes = document.getElementById('eventNotes').value.trim();

        if (startTime >= endTime) {
          Toast.show('Время окончания должно быть позже времени начала!', 'warning');
          return;
        }

        const newEvent = {
          id: editId || 'ev-' + Date.now(),
          title,
          category,
          day,
          startTime,
          endTime,
          notes,
          completed: false
        };

        if (editId) {
          lifeStorage.updateScheduleEvent(newEvent);
          Toast.show('Занятие обновлено!', 'success');
        } else {
          lifeStorage.addScheduleEvent(newEvent);
          Toast.show('Занятие добавлено в расписание!', 'success');
        }

        Modal.close('addEventModal');
        addEventForm.reset();
        this.renderSchedule();
        this.renderDashboard();
        lifeSound.playSuccess();
      });
    }
  }

  openAddEventModal(defaultDay = 'mon') {
    const form = document.getElementById('addEventForm');
    if (form) form.reset();
    document.getElementById('eventEditId').value = '';
    document.getElementById('eventModalTitle').textContent = 'Добавить занятие в расписание';
    document.getElementById('eventDay').value = defaultDay;
    Modal.open('addEventModal');
  }

  renderSchedule() {
    const allEvents = lifeStorage.getSchedule();
    const day = this.selectedScheduleDay;
    const cat = this.selectedScheduleCategory;

    let events = allEvents.filter(e => e.day === day);
    if (cat !== 'all') {
      events = events.filter(e => e.category === cat);
    }
    events.sort((a, b) => a.startTime.localeCompare(b.startTime));

    // Сводные метрики
    const totalEventsEl = document.getElementById('schedTotalEvents');
    if (totalEventsEl) totalEventsEl.textContent = events.length;

    let studyMinutes = 0;
    let sportMinutes = 0;

    allEvents.filter(e => e.day === day).forEach(ev => {
      const dur = this.getDurationMinutes(ev.startTime, ev.endTime);
      if (ev.category === 'study') studyMinutes += dur;
      if (ev.category === 'sport') sportMinutes += dur;
    });

    const studyHoursEl = document.getElementById('schedStudyHours');
    if (studyHoursEl) studyHoursEl.textContent = `${(studyMinutes / 60).toFixed(1)} ч`;

    const sportHoursEl = document.getElementById('schedSportHours');
    if (sportHoursEl) sportHoursEl.textContent = `${(sportMinutes / 60).toFixed(1)} ч`;

    const hourlyList = document.getElementById('hourlyScheduleList');
    if (!hourlyList) return;

    if (events.length === 0) {
      hourlyList.innerHTML = `
        <div class="empty-state text-center py-5 text-muted">
          <div style="font-size: 2.5rem; margin-bottom: 12px;">📅</div>
          <h4>Свободный день или нет занятий</h4>
          <p class="text-xs mb-3">В этот день пока ничего не запланировано</p>
          <button class="btn btn-primary btn-sm" onclick="app.openAddEventModal('${day}')">+ Запланировать занятие</button>
        </div>
      `;
      return;
    }

    const categoryNames = {
      study: '📘 Учёба',
      sport: '🏃 Спорт',
      work: '💼 Работа',
      rest: '☕ Отдых',
      other: '🌟 Личное'
    };

    hourlyList.innerHTML = events.map(ev => {
      return `
        <div class="schedule-card-item cat-${ev.category}">
          <div class="sched-time-block">
            <span class="sched-start-end">${ev.startTime} – ${ev.endTime}</span>
            <span class="sched-dur">${this.calculateDuration(ev.startTime, ev.endTime)}</span>
          </div>
          <div class="sched-detail-block">
            <div class="sched-title">${this.escapeHtml(ev.title)}</div>
            <div class="sched-notes">
              <span class="event-category-tag tag-${ev.category}">${categoryNames[ev.category] || ev.category}</span>
              ${ev.notes ? `<span>• ${this.escapeHtml(ev.notes)}</span>` : ''}
            </div>
          </div>
          <div class="sched-actions-block">
            <button class="icon-btn" title="Удалить" onclick="app.handleDeleteEvent('${ev.id}')">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  handleDeleteEvent(id) {
    if (confirm('Удалить это занятие из расписания?')) {
      lifeStorage.deleteScheduleEvent(id);
      this.renderSchedule();
      this.renderDashboard();
      Toast.show('Занятие удалено', 'info');
      lifeSound.playClick();
    }
  }

  /* ==========================================================================
     3. ЗАДАЧИ & ПРОЕКТЫ (TASKS)
     ========================================================================== */

  bindTasksActions() {
    // Фильтр по статусу (Все, В процессе, Завершённые)
    const statusFilters = document.getElementById('taskStatusFilters');
    if (statusFilters) {
      statusFilters.querySelectorAll('.tasks-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          statusFilters.querySelectorAll('.tasks-tab-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.selectedTaskStatus = btn.getAttribute('data-status');
          this.renderTasks();
          lifeSound.playClick();
        });
      });
    }

    // Фильтр по приоритету
    const prioSelect = document.getElementById('taskPrioritySelect');
    if (prioSelect) {
      prioSelect.addEventListener('change', (e) => {
        this.selectedTaskPriority = e.target.value;
        this.renderTasks();
      });
    }

    // Открытие модалки создания задачи
    const btnOpenNewTaskModal = document.getElementById('btnOpenNewTaskModal');
    if (btnOpenNewTaskModal) {
      btnOpenNewTaskModal.addEventListener('click', () => {
        this.openAddTaskModal();
      });
    }

    // Форма сохранения задачи
    const addTaskForm = document.getElementById('addTaskForm');
    if (addTaskForm) {
      addTaskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('taskTitle').value.trim();
        const category = document.getElementById('taskCategory').value;
        const priority = document.getElementById('taskPriority').value;
        const dueDate = document.getElementById('taskDueDate').value;
        const estMinutes = parseInt(document.getElementById('taskEstMinutes').value, 10) || 30;

        lifeStorage.addTask({
          id: 'task-' + Date.now(),
          title,
          category,
          priority,
          dueDate,
          estMinutes,
          completed: false
        });

        Modal.close('addTaskModal');
        addTaskForm.reset();
        this.renderTasks();
        this.renderDashboard();
        lifeSound.playSuccess();
        Toast.show('Задача успешно создана!', 'success');
      });
    }
  }

  openAddTaskModal() {
    const form = document.getElementById('addTaskForm');
    if (form) form.reset();
    const today = new Date().toISOString().split('T')[0];
    const dueDateInput = document.getElementById('taskDueDate');
    if (dueDateInput) dueDateInput.value = today;
    Modal.open('addTaskModal');
  }

  handleTaskToggle(e) {
    const btn = e.target.closest('[data-action="toggle-task"]');
    if (!btn) return;
    const id = btn.getAttribute('data-id');
    const task = lifeStorage.toggleTask(id);

    if (task && task.completed) {
      lifeSound.playCheck();
      Toast.show('Задача выполнена! Отличная работа! 🎯', 'success');
    } else {
      lifeSound.playClick();
    }

    this.renderTasks();
    this.renderDashboard();
  }

  handleDeleteTask(id) {
    if (confirm('Удалить эту задачу?')) {
      lifeStorage.deleteTask(id);
      this.renderTasks();
      this.renderDashboard();
      Toast.show('Задача удалена', 'info');
      lifeSound.playClick();
    }
  }

  renderTasks() {
    const tasks = lifeStorage.getTasks();

    // Счётчики табов
    const countAll = document.getElementById('countAllTasks');
    const countPending = document.getElementById('countPendingTasks');
    const countCompleted = document.getElementById('countCompletedTasks');

    const pendingList = tasks.filter(t => !t.completed);
    const completedList = tasks.filter(t => t.completed);

    if (countAll) countAll.textContent = tasks.length;
    if (countPending) countPending.textContent = pendingList.length;
    if (countCompleted) countCompleted.textContent = completedList.length;

    let filtered = tasks;
    if (this.selectedTaskStatus === 'pending') filtered = pendingList;
    if (this.selectedTaskStatus === 'completed') filtered = completedList;

    if (this.selectedTaskPriority !== 'all') {
      filtered = filtered.filter(t => t.priority === this.selectedTaskPriority);
    }

    this.renderTasksListFiltered(filtered);
    this.updateBadges();
  }

  renderTasksListFiltered(tasks) {
    const container = document.getElementById('tasksContainer');
    if (!container) return;

    if (tasks.length === 0) {
      container.innerHTML = `
        <div class="empty-state text-center py-5 text-muted">
          <div style="font-size: 2.5rem; margin-bottom: 12px;">✅</div>
          <h4>Задач в этом разделе нет</h4>
          <p class="text-xs mb-3">Всё чисто! Вы можете добавить новое дело или проект</p>
          <button class="btn btn-primary btn-sm" onclick="app.openAddTaskModal()">+ Добавить задачу</button>
        </div>
      `;
      return;
    }

    const priorityBadges = {
      high: '<span class="badge" style="background: rgba(239, 68, 68, 0.15); color: #EF4444;">🔴 Высокий</span>',
      medium: '<span class="badge" style="background: rgba(245, 158, 11, 0.15); color: #F59E0B;">🟡 Средний</span>',
      low: '<span class="badge" style="background: rgba(16, 185, 129, 0.15); color: #10B981;">🟢 Низкий</span>'
    };

    container.innerHTML = tasks.map(t => `
      <div class="task-card-full ${t.completed ? 'is-done' : ''}">
        <button class="custom-checkbox ${t.completed ? 'checked' : ''}" data-action="toggle-task" data-id="${t.id}">
          ${t.completed ? '✓' : ''}
        </button>
        <div class="task-full-info">
          <div class="task-full-title">${this.escapeHtml(t.title)}</div>
          <div class="task-full-meta">
            ${priorityBadges[t.priority] || ''}
            ${t.dueDate ? `<span class="task-due-badge">📅 Дедлайн: ${t.dueDate}</span>` : ''}
            ${t.estMinutes ? `<span>⏱️ ~${t.estMinutes} мин</span>` : ''}
          </div>
        </div>
        <div class="task-actions">
          <button class="icon-btn" title="Удалить задачу" onclick="app.handleDeleteTask('${t.id}')">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('[data-action="toggle-task"]').forEach(btn => {
      btn.addEventListener('click', (e) => this.handleTaskToggle(e));
    });
  }

  /* ==========================================================================
     6. СТРАТЕГИЧЕСКИЕ ЦЕЛИ (GOALS)
     ========================================================================== */

  bindGoalsActions() {
    const btnOpenNewGoalModal = document.getElementById('btnOpenNewGoalModal');
    if (btnOpenNewGoalModal) {
      btnOpenNewGoalModal.addEventListener('click', () => {
        const form = document.getElementById('addGoalForm');
        if (form) form.reset();
        Modal.open('addGoalModal');
      });
    }

    const addGoalForm = document.getElementById('addGoalForm');
    if (addGoalForm) {
      addGoalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('goalTitle').value.trim();
        const category = document.getElementById('goalCategory').value;
        const deadline = document.getElementById('goalDeadline').value;
        const rawMilestones = document.getElementById('goalMilestones').value.trim();

        const milestones = rawMilestones
          ? rawMilestones.split(/[\n,]+/).map((m, i) => ({ id: `m-${Date.now()}-${i}`, title: m.trim(), done: false })).filter(m => m.title)
          : [];

        lifeStorage.addGoal({
          id: 'goal-' + Date.now(),
          title,
          category,
          categoryName: category === 'education' ? 'Образование' : category === 'fitness' ? 'Спорт' : 'Карьера',
          icon: category === 'fitness' ? '🏃' : category === 'education' ? '🎓' : '💼',
          deadline,
          milestones
        });

        Modal.close('addGoalModal');
        this.renderGoals();
        this.renderDashboard();
        lifeSound.playSuccess();
        Toast.show('Новая цель поставлена! Путь начинается 🚀', 'success');
      });
    }
  }

  handleToggleMilestone(goalId, milestoneId) {
    const updated = lifeStorage.toggleMilestone(goalId, milestoneId);
    if (updated) {
      lifeSound.playCheck();
      const goal = lifeStorage.getGoals().find(g => g.id === goalId);
      const total = goal.milestones.length;
      const completed = goal.milestones.filter(m => m.done).length;

      if (total > 0 && completed === total) {
        Confetti.burst(90);
        Toast.show(`🎉 Поздравляем! Цель «${goal.title}» выполнена на 100%!`, 'sparkle');
      } else {
        Toast.show('Этап цели отмечен!', 'success');
      }
    }
    this.renderGoals();
  }

  handleDeleteGoal(id) {
    if (confirm('Удалить эту цель?')) {
      lifeStorage.deleteGoal(id);
      this.renderGoals();
      Toast.show('Цель удалена', 'info');
      lifeSound.playClick();
    }
  }

  renderGoals() {
    const goals = lifeStorage.getGoals();
    const grid = document.getElementById('goalsGrid');
    if (!grid) return;

    if (goals.length === 0) {
      grid.innerHTML = `
        <div class="empty-state text-center py-5 text-muted col-span-full">
          <div style="font-size: 2.5rem; margin-bottom: 12px;">🎯</div>
          <h4>Нет активных целей</h4>
          <p class="text-xs mb-3">Поставьте вдохновляющую цель на ближайшие месяцы</p>
          <button class="btn btn-primary btn-sm" onclick="Modal.open('addGoalModal')">+ Поставить цель</button>
        </div>
      `;
      return;
    }

    grid.innerHTML = goals.map(g => {
      const total = g.milestones ? g.milestones.length : 0;
      const done = g.milestones ? g.milestones.filter(m => m.done).length : 0;
      const pct = total > 0 ? Math.round((done / total) * 100) : 0;

      return `
        <div class="goal-card">
          <div>
            <div class="goal-header">
              <div class="goal-icon-badge icon-purple">${g.icon || '🎯'}</div>
              <button class="icon-btn" title="Удалить цель" onclick="app.handleDeleteGoal('${g.id}')">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>

            <span class="goal-category-tag">${g.categoryName || 'Стратегия'}</span>
            <h3 class="goal-title">${this.escapeHtml(g.title)}</h3>
            ${g.deadline ? `<div class="goal-deadline">Дедлайн: ${g.deadline}</div>` : ''}

            <div class="goal-progress-wrap mb-3">
              <div class="progress-bar-bg">
                <div class="progress-bar-fill" style="width: ${pct}%;"></div>
              </div>
              <span class="goal-pct-txt">${pct}%</span>
            </div>

            <div class="goal-milestones-list">
              ${(g.milestones || []).map(m => `
                <div class="milestone-item ${m.done ? 'done' : ''}">
                  <button class="custom-checkbox ${m.done ? 'checked' : ''}" onclick="app.handleToggleMilestone('${g.id}', '${m.id}')">
                    ${m.done ? '✓' : ''}
                  </button>
                  <span>${this.escapeHtml(m.title)}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  /* ==========================================================================
     7. ПРИВЫЧКИ (HABITS)
     ========================================================================== */

  bindHabitsActions() {
    const btnOpenNewHabitModal = document.getElementById('btnOpenNewHabitModal');
    if (btnOpenNewHabitModal) {
      btnOpenNewHabitModal.addEventListener('click', () => {
        const form = document.getElementById('addHabitForm');
        if (form) form.reset();
        Modal.open('addHabitModal');
      });
    }

    const addHabitForm = document.getElementById('addHabitForm');
    if (addHabitForm) {
      addHabitForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('habitTitle').value.trim();
        const category = document.getElementById('habitCategory').value;
        const timeOfDay = document.getElementById('habitTimeOfDay').value;

        const categoryIcons = {
          health: '💧',
          study: '📖',
          sport: '⚡',
          mind: '🌙'
        };

        lifeStorage.addHabit({
          id: 'hab-' + Date.now(),
          title,
          category,
          categoryName: category === 'health' ? 'Здоровье' : category === 'study' ? 'Обучение' : category === 'sport' ? 'Спорт' : 'Ментальное',
          icon: categoryIcons[category] || '🔥',
          timeOfDay,
          streak: 1,
          history: { mon: false, tue: false, wed: false, thu: false, fri: false, sat: false, sun: false }
        });

        Modal.close('addHabitModal');
        this.renderHabits();
        this.renderDashboard();
        lifeSound.playSuccess();
        Toast.show('Привычка добавлена! Начните серию сегодня 🔥', 'success');
      });
    }
  }

  handleHabitToggle(e) {
    const btn = e.target.closest('[data-action="toggle-habit"]');
    if (!btn) return;
    const habitId = btn.getAttribute('data-id');
    const dayKey = btn.getAttribute('data-day') || 'mon';

    const habit = lifeStorage.toggleHabitDay(habitId, dayKey);
    if (habit && habit.history[dayKey]) {
      lifeSound.playCheck();
      Toast.show(`🔥 Серия привычки выросла: ${habit.streak} дней!`, 'success');
    } else {
      lifeSound.playClick();
    }

    this.renderHabits();
    this.renderDashboard();
  }

  handleDeleteHabit(id) {
    if (confirm('Удалить эту привычку?')) {
      lifeStorage.deleteHabit(id);
      this.renderHabits();
      this.renderDashboard();
      Toast.show('Привычка удалена', 'info');
      lifeSound.playClick();
    }
  }

  renderHabits() {
    const habits = lifeStorage.getHabits();
    const tbody = document.getElementById('habitsFullTableBody');
    const weekHdr = document.getElementById('habitWeekDaysHeader');

    const days = [
      { key: 'mon', label: 'Пн' },
      { key: 'tue', label: 'Вт' },
      { key: 'wed', label: 'Ср' },
      { key: 'thu', label: 'Чт' },
      { key: 'fri', label: 'Пт' },
      { key: 'sat', label: 'Сб' },
      { key: 'sun', label: 'Вс' }
    ];

    if (weekHdr) {
      weekHdr.innerHTML = days.map(d => `
        <div class="week-day-col-hdr ${d.key === 'mon' ? 'text-accent' : ''}">${d.label}</div>
      `).join('');
    }

    if (!tbody) return;

    if (habits.length === 0) {
      tbody.innerHTML = `
        <div class="empty-state text-center py-5 text-muted">
          <p>Нет добавленных привычек. Начните формировать полезный образ жизни прямо сейчас!</p>
          <button class="btn btn-primary btn-sm mt-2" onclick="Modal.open('addHabitModal')">+ Добавить привычку</button>
        </div>
      `;
      return;
    }

    tbody.innerHTML = habits.map(h => {
      return `
        <div class="habit-table-row">
          <div class="habit-info-cell">
            <span class="habit-icon">${h.icon || '🔥'}</span>
            <div>
              <div class="habit-name">${this.escapeHtml(h.title)}</div>
              <span class="habit-tag">${h.categoryName || h.category}</span>
            </div>
          </div>
          <div class="habit-streak-cell">🔥 ${h.streak} дн</div>
          <div class="habit-days-cell">
            ${days.map(d => {
              const isDone = h.history && h.history[d.key];
              const isToday = d.key === 'mon' ? 'today' : '';
              return `
                <button class="day-check-btn ${isDone ? 'completed' : ''} ${isToday}" 
                        data-action="toggle-habit" 
                        data-id="${h.id}" 
                        data-day="${d.key}" 
                        title="${d.label}: ${isDone ? 'Выполнено' : 'Не выполнено'}">
                  ${isDone ? '✓' : ''}
                </button>
              `;
            }).join('')}
          </div>
          <div class="habit-actions-cell">
            <button class="icon-btn" title="Удалить" onclick="app.handleDeleteHabit('${h.id}')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </div>
      `;
    }).join('');

    tbody.querySelectorAll('[data-action="toggle-habit"]').forEach(btn => {
      btn.addEventListener('click', (e) => this.handleHabitToggle(e));
    });

    this.updateBadges();
  }

  /* ==========================================================================
     8. СТАТИСТИКА И АНАЛИТИКА (ANALYTICS)
     ========================================================================== */

  renderAnalytics() {
    const data = lifeStorage.data.analytics;
    if (!data) return;

    // Отрисовка SVG пончика распределения времени
    const donutSvg = document.getElementById('lifeBalanceDonut');
    const legendEl = document.getElementById('chartCategoriesLegend');

    if (donutSvg && legendEl) {
      const cats = Object.values(data.categories);
      const totalHours = cats.reduce((sum, c) => sum + c.hours, 0);

      let currentAngle = 0;
      let pathsSvg = '';

      legendEl.innerHTML = cats.map(c => {
        const pct = Math.round((c.hours / totalHours) * 100);
        return `
          <div class="legend-item">
            <div class="legend-left">
              <span class="legend-color-dot" style="background: ${c.color};"></span>
              <span>${c.label}</span>
            </div>
            <span class="legend-val">${c.hours} ч (${pct}%)</span>
          </div>
        `;
      }).join('');

      // Рисуем кольцевые дуги
      const r = 38;
      const cx = 50;
      const cy = 50;

      cats.forEach(c => {
        const sliceAngle = (c.hours / totalHours) * 360;
        const x1 = cx + r * Math.cos((Math.PI * currentAngle) / 180);
        const y1 = cy + r * Math.sin((Math.PI * currentAngle) / 180);
        const x2 = cx + r * Math.cos((Math.PI * (currentAngle + sliceAngle)) / 180);
        const y2 = cy + r * Math.sin((Math.PI * (currentAngle + sliceAngle)) / 180);

        const largeArc = sliceAngle > 180 ? 1 : 0;
        const d = `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;

        pathsSvg += `<path d="${d}" fill="none" stroke="${c.color}" stroke-width="12" stroke-linecap="round" />`;
        currentAngle += sliceAngle;
      });

      donutSvg.innerHTML = pathsSvg;
    }

    // Отрисовка столбчатого графика недельной активности
    const barChart = document.getElementById('weeklyBarChart');
    if (barChart && data.weeklyDays) {
      const maxHours = Math.max(...data.weeklyDays.map(d => d.hours), 10);
      barChart.innerHTML = data.weeklyDays.map(d => {
        const heightPct = Math.round((d.hours / maxHours) * 100);
        return `
          <div class="bar-col">
            <div class="bar-tube-wrap">
              <span class="bar-val-tip">${d.hours}ч</span>
              <div class="bar-fill" style="height: ${heightPct}%;"></div>
            </div>
            <span class="bar-day-lbl">${d.day}</span>
          </div>
        `;
      }).join('');
    }
  }

  /* ==========================================================================
     УТИЛИТЫ И ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
     ========================================================================== */

  calculateDuration(start, end) {
    const mins = this.getDurationMinutes(start, end);
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h > 0 && m > 0) return `${h} ч ${m} мин`;
    if (h > 0) return `${h} час${h > 1 ? 'а' : ''}`;
    return `${m} мин`;
  }

  getDurationMinutes(start, end) {
    if (!start || !end) return 0;
    const [h1, m1] = start.split(':').map(Number);
    const [h2, m2] = end.split(':').map(Number);
    return Math.max(0, (h2 * 60 + m2) - (h1 * 60 + m1));
  }

  escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

// Запуск приложения при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  window.app = new LifeOSApp();
});
