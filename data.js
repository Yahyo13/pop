/**
 * LifeOS Initial Seed Data
 * Предустановленные реалистичные данные для мгновенного погружения пользователя
 */

const DEFAULT_LIFEOS_DATA = {
  // События расписания по дням недели (mon, tue, wed, thu, fri, sat, sun)
  schedule: [
    {
      id: "ev-1",
      day: "mon",
      title: "Пара по высшей математике (Лекция)",
      category: "study",
      startTime: "09:00",
      endTime: "10:30",
      notes: "Аудитория 402, подготовить конспект",
      completed: true
    },
    {
      id: "ev-2",
      day: "mon",
      title: "Контрольная работа по математическому анализу",
      category: "study",
      startTime: "11:00",
      endTime: "12:30",
      notes: "Взять калькулятор и черновики. Приоритет!",
      completed: true
    },
    {
      id: "ev-3",
      day: "mon",
      title: "Обед и прогулка на свежем воздухе",
      category: "rest",
      startTime: "13:00",
      endTime: "14:00",
      notes: "Студенческое кафе, разгрузка мозга",
      completed: true
    },
    {
      id: "ev-4",
      day: "mon",
      title: "Практика по программированию (JS)",
      category: "study",
      startTime: "14:30",
      endTime: "16:00",
      notes: "Работа над проектом LifeOS",
      completed: false
    },
    {
      id: "ev-5",
      day: "mon",
      title: "Силовая тренировка в спортзале",
      category: "sport",
      startTime: "17:00",
      endTime: "18:30",
      notes: "День спины и кардио 20 мин",
      completed: false
    },
    {
      id: "ev-6",
      day: "mon",
      title: "Домашка по английскому языку",
      category: "study",
      startTime: "19:30",
      endTime: "21:00",
      notes: "Эссе на 250 слов + упражнения грамматики B2",
      completed: false
    },
    // Вторник
    {
      id: "ev-7",
      day: "tue",
      title: "Физика: лабораторная работа",
      category: "study",
      startTime: "10:00",
      endTime: "12:00",
      notes: "Корпус Б, лаб. 12",
      completed: false
    },
    {
      id: "ev-8",
      day: "tue",
      title: "Английский с репетитором",
      category: "study",
      startTime: "15:00",
      endTime: "16:30",
      notes: "Zoom созвон, разбор B2 Speaking",
      completed: false
    },
    {
      id: "ev-9",
      day: "tue",
      title: "Пробежка в парке",
      category: "sport",
      startTime: "18:00",
      endTime: "19:00",
      notes: "5 км в спокойном темпе",
      completed: false
    },
    // Среда
    {
      id: "ev-10",
      day: "wed",
      title: "Семинар по базам данных SQL",
      category: "study",
      startTime: "09:30",
      endTime: "11:30",
      notes: "Защитить 3-е задание",
      completed: false
    },
    {
      id: "ev-11",
      day: "wed",
      title: "Тренировка в зале (ноги/пресс)",
      category: "sport",
      startTime: "17:00",
      endTime: "18:30",
      notes: "Разминка обязательна",
      completed: false
    },
    // Четверг
    {
      id: "ev-12",
      day: "thu",
      title: "Проектная работа и хакатон",
      category: "work",
      startTime: "13:00",
      endTime: "16:00",
      notes: "Синхронизация с командой",
      completed: false
    },
    // Пятница
    {
      id: "ev-13",
      day: "fri",
      title: "Контрольное тестирование",
      category: "study",
      startTime: "11:00",
      endTime: "13:00",
      notes: "Финальная оценка за модуль",
      completed: false
    },
    {
      id: "ev-14",
      day: "fri",
      title: "Настольные игры с друзьями",
      category: "rest",
      startTime: "19:00",
      endTime: "22:00",
      notes: "Качественный отдых на выходных",
      completed: false
    }
  ],

  // Список задач
  tasks: [
    {
      id: "task-1",
      title: "Подготовиться к контрольной по матанализу (теоремы Ролля и Лагранжа)",
      category: "study",
      priority: "high",
      dueDate: "2026-10-27",
      estMinutes: 90,
      completed: true
    },
    {
      id: "task-2",
      title: "Написать эссе на английском: «AI in Education»",
      category: "study",
      priority: "high",
      dueDate: "2026-10-28",
      estMinutes: 60,
      completed: false
    },
    {
      id: "task-3",
      title: "Собрать спортивную сумку и шейкер на тренировку",
      category: "sport",
      priority: "medium",
      dueDate: "2026-10-27",
      estMinutes: 15,
      completed: true
    },
    {
      id: "task-4",
      title: "Завершить вёрстку адаптивного сайдбара для LifeOS",
      category: "work",
      priority: "high",
      dueDate: "2026-10-29",
      estMinutes: 120,
      completed: false
    },
    {
      id: "task-5",
      title: "Прочитать главу 4 книги «Атомные привычки»",
      category: "personal",
      priority: "low",
      dueDate: "2026-10-27",
      estMinutes: 30,
      completed: false
    },
    {
      id: "task-6",
      title: "Разобрать конспекты лекций по физике",
      category: "study",
      priority: "medium",
      dueDate: "2026-10-30",
      estMinutes: 45,
      completed: false
    }
  ],

  // Стратегические цели
  goals: [
    {
      id: "goal-1",
      title: "Выучить английский язык до уровня B2 за 6 месяцев",
      category: "education",
      categoryName: "Образование",
      icon: "🇬🇧",
      deadline: "2027-04-15",
      color: "#3B82F6",
      milestones: [
        { id: "m-1", title: "Выучить 500 новых слов уровня Upper-Intermediate", done: true },
        { id: "m-2", title: "Разобрать все 12 временных форм и пассивный залог", done: true },
        { id: "m-3", title: "Написать 10 эссе с проверкой преподавателя", done: true },
        { id: "m-4", title: "Пройти 20 часов разговорной практики в клубе", done: false },
        { id: "m-5", title: "Сдать пробный экзамен Cambridge FCE на 165+ баллов", done: false }
      ]
    },
    {
      id: "goal-2",
      title: "Освоить Frontend разработку и запустить 3 pet-проекта",
      category: "career",
      categoryName: "Карьера",
      icon: "💻",
      deadline: "2026-12-31",
      color: "#8B5CF6",
      milestones: [
        { id: "m-6", title: "Изучить семантический HTML5 и современный CSS Grid/Flexbox", done: true },
        { id: "m-7", title: "Освоить JavaScript ES6+, асинхронность и работу с DOM", done: true },
        { id: "m-8", title: "Создать и опубликовать сервис LifeOS", done: true },
        { id: "m-9", title: "Развернуть приложение погоды на чистом API", done: false }
      ]
    },
    {
      id: "goal-3",
      title: "Пробежать полумарафон (21.1 км) за 2 часа",
      category: "fitness",
      categoryName: "Спорт",
      icon: "🏃‍♂️",
      deadline: "2027-05-20",
      color: "#F97316",
      milestones: [
        { id: "m-10", title: "Пробежать первые 5 км без остановки", done: true },
        { id: "m-11", title: "Взять дистанцию 10 км быстрее 55 минут", done: true },
        { id: "m-12", title: "Длинная тренировка на 15 км в целевом темпе", done: false },
        { id: "m-13", title: "Участие в официальном городском забеге", done: false }
      ]
    }
  ],

  // Трекер привычек
  habits: [
    {
      id: "hab-1",
      title: "Пить 2 литра чистой воды в день",
      category: "health",
      categoryName: "Здоровье",
      icon: "💧",
      streak: 12,
      timeOfDay: "any",
      history: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: true, sun: true }
    },
    {
      id: "hab-2",
      title: "20 минут чтения развивающей книги",
      category: "study",
      categoryName: "Обучение",
      icon: "📖",
      streak: 5,
      timeOfDay: "evening",
      history: { mon: true, tue: true, wed: false, thu: true, fri: true, sat: true, sun: false }
    },
    {
      id: "hab-3",
      title: "Утренняя зарядка и разминка суставов",
      category: "sport",
      categoryName: "Спорт",
      icon: "⚡",
      streak: 8,
      timeOfDay: "morning",
      history: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: false, sun: true }
    },
    {
      id: "hab-4",
      title: "15 минут карточек со словами английского",
      category: "study",
      categoryName: "Обучение",
      icon: "🇬🇧",
      streak: 19,
      timeOfDay: "day",
      history: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: true, sun: true }
    },
    {
      id: "hab-5",
      title: "Ложиться спать до 23:30 (без экрана)",
      category: "mind",
      categoryName: "Ментальное",
      icon: "🌙",
      streak: 4,
      timeOfDay: "evening",
      history: { mon: false, tue: true, wed: true, thu: true, fri: true, sat: false, sun: false }
    }
  ],

  // Недельная статистика часов
  analytics: {
    categories: {
      study: { hours: 28.5, label: "Учёба и курсы", color: "#3B82F6" },
      sport: { hours: 7.0, label: "Спорт и зал", color: "#F97316" },
      rest: { hours: 14.0, label: "Отдых и сон", color: "#10B981" },
      work: { hours: 9.5, label: "Проекты и дела", color: "#8B5CF6" }
    },
    weeklyDays: [
      { day: "Пн", hours: 7.5, study: 4.5, sport: 1.5, rest: 1.5 },
      { day: "Вт", hours: 6.8, study: 4.0, sport: 1.0, rest: 1.8 },
      { day: "Ср", hours: 8.2, study: 5.5, sport: 1.5, rest: 1.2 },
      { day: "Чт", hours: 6.0, study: 3.5, sport: 0.5, rest: 2.0 },
      { day: "Пт", hours: 7.0, study: 4.0, sport: 1.0, rest: 2.0 },
      { day: "Сб", hours: 5.5, study: 2.0, sport: 1.5, rest: 2.0 },
      { day: "Вс", hours: 4.5, study: 1.5, sport: 0.0, rest: 3.0 }
    ]
  }
};
