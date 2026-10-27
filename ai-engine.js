/**
 * LifeOS AI Engine
 * 1. Интеллектуальный парсер и генератор реалистичного плана дня
 * 2. Декомпозитор сложных задач на простые микро-шаги (20-40 мин)
 */

class AiEngine {
  constructor() {
    this.thinkingSteps = [
      "Анализирую текст и выявляю ключевые события...",
      "Определяю приоритеты и жесткие временные рамки...",
      "Рассчитываю когнитивную нагрузку и биоритмы...",
      "Добавляю восстановительные буферы и паузы...",
      "Формирую сбалансированное расписание..."
    ];
  }

  /**
   * Генерация расписания дня по текстовому запросу
   */
  async generateDailyPlan(userInput, onProgress) {
    // Симуляция мыслительного процесса ИИ со сменой шагов
    const totalSteps = this.thinkingSteps.length;
    for (let i = 0; i < totalSteps; i++) {
      if (onProgress) {
        onProgress(this.thinkingSteps[i], Math.round(((i + 1) / totalSteps) * 100));
      }
      await new Promise(r => setTimeout(r, 380));
    }

    const text = (userInput || '').toLowerCase();

    // Анализ ключевых тем
    const hasControls = text.includes('контрольн') || text.includes('экзамен') || text.includes('тест') || text.includes('пара') || text.includes('урок');
    const hasSport = text.includes('тренировк') || text.includes('зал') || text.includes('спорт') || text.includes('пробежк');
    const hasHomework = text.includes('домашк') || text.includes('дз') || text.includes('задани') || text.includes('учёб') || text.includes('учеб');
    const hasProject = text.includes('проект') || text.includes('дедлайн') || text.includes('программир') || text.includes('сайт');
    const hasRelax = text.includes('фильм') || text.includes('друзья') || text.includes('отдых') || text.includes('погулять') || text.includes('уборк');

    // Проверка явного времени в тексте (например 17:00 или 14:00)
    const timeMatch = text.match(/(\d{1,2})[:.]00/);
    let fixedTime = timeMatch ? parseInt(timeMatch[1], 10) : null;

    let planItems = [];
    let advice = "";
    let headline = "Оптимальный баланс энергии и фокуса";

    // Специализированные сценарии
    if (hasControls && hasSport) {
      headline = "План: 3 контрольные + спорт в 17:00 + домашка";
      advice = "🧠 Обоснование ИИ: Контрольные требуют предельной свежести мозга, поэтому они стоят первыми. До тренировки в 17:00 добавлен обязательный перекус и отдых, чтобы избежать переутомления. Домашка перенесена на комфортный вечерний отрезок (19:30).";
      planItems = [
        {
          startTime: "08:00",
          endTime: "08:45",
          title: "Завтрак чемпиона + настройка фокуса",
          category: "rest",
          reason: "Легкий углеводный завтрак и повторение формул",
          badge: "Старт дня"
        },
        {
          startTime: "09:00",
          endTime: "10:30",
          title: "Контрольная работа №1 (Математика / Алгебра)",
          category: "study",
          reason: "Пик утренней концентрации коры головного мозга",
          badge: "Высокий приоритет 🔴"
        },
        {
          startTime: "10:45",
          endTime: "12:15",
          title: "Контрольная работа №2 (Физика / Теория)",
          category: "study",
          reason: "Второй блок с 15-минутной паузой для перезагрузки",
          badge: "Высокий приоритет 🔴"
        },
        {
          startTime: "12:45",
          endTime: "13:45",
          title: "Контрольная работа №3 + сдача работ",
          category: "study",
          reason: "Финальный рывок перед большим перерывом",
          badge: "Экзамен"
        },
        {
          startTime: "14:00",
          endTime: "15:30",
          title: "Сытный обед и прогулка без гаджетов",
          category: "rest",
          reason: "Обязательное восстановление дофамина и сил",
          badge: "Восстановление 🌿"
        },
        {
          startTime: "15:30",
          endTime: "16:30",
          title: "Разбор черновиков и подготовка формы в зал",
          category: "work",
          reason: "Спокойная механическая задача без сильного стресса",
          badge: "Подготовка"
        },
        {
          startTime: "17:00",
          endTime: "18:30",
          title: "Тренировка в спортзале (силовая + кардио)",
          category: "sport",
          reason: "Физическая активность снимает умственное напряжение от контрольных",
          badge: "Спорт 🏃"
        },
        {
          startTime: "19:00",
          endTime: "19:45",
          title: "Ужин и гидратация",
          category: "rest",
          reason: "Белковый ужин и 2 стакана воды",
          badge: "Питание"
        },
        {
          startTime: "20:00",
          endTime: "21:30",
          title: "Выполнение домашнего задания (Английский / Проекты)",
          category: "study",
          reason: "90 минут сфокусированной работы методом Pomodoro",
          badge: "Учёба 📘"
        },
        {
          startTime: "22:00",
          endTime: "23:00",
          title: "Отдых, душ и чтение книги перед сном",
          category: "rest",
          reason: "Защита циркадных ритмов и качественный сон",
          badge: "Сон 🌙"
        }
      ];
    } else if (hasProject || text.includes('дедлайн')) {
      headline = "Спринт с дедлайном и защитой от перегрузки";
      advice = "🧠 Обоснование ИИ: При дедлайнах критично разделить задачу на 2 спринта с полноценным перерывом на обед, иначе после 16:00 наступает спад внимания.";
      planItems = [
        {
          startTime: "09:00",
          endTime: "12:00",
          title: "Глубокий спринт по проекту: ключевой функционал",
          category: "work",
          reason: "3 сессии по 45 мин без отвлечений на соцсети",
          badge: "Deep Work 🔥"
        },
        {
          startTime: "12:00",
          endTime: "13:30",
          title: "Обед и прогулка на свежем воздухе",
          category: "rest",
          reason: "Смена обстановки для генерации свежих идей",
          badge: "Отдых ☕"
        },
        {
          startTime: "14:00",
          endTime: "15:00",
          title: "Созвон / синхронизация по статусу",
          category: "work",
          reason: "Уточнение требований и финальных правок",
          badge: "Связь"
        },
        {
          startTime: "15:30",
          endTime: "18:30",
          title: "Финальная полировка, тестирование и сдача",
          category: "work",
          reason: "Закрытие проекта за 30 минут до дедлайна",
          badge: "Дедлайн 🎯"
        },
        {
          startTime: "19:00",
          endTime: "20:30",
          title: "Спортзал или пробежка",
          category: "sport",
          reason: "Сброс кортизола после интенсивного спринта",
          badge: "Спорт 🏃"
        },
        {
          startTime: "21:00",
          endTime: "23:00",
          title: "Празднование сдачи и свободный вечер",
          category: "rest",
          reason: "Награда мозгу за продуктивный день",
          badge: "Релакс ✨"
        }
      ];
    } else {
      // Универсальный умный сбалансированный день
      headline = "Сбалансированное умное расписание дня";
      advice = "🧠 Обоснование ИИ: Равномерное чередование умственной деятельности, физической активности и отдыха позволяет сохранять продуктивность на уровне 90%+ весь день.";
      planItems = [
        {
          startTime: "08:30",
          endTime: "09:30",
          title: "Утренняя рутина, завтрак и планирование",
          category: "rest",
          reason: "Плавный вход в день без спешки",
          badge: "Утро"
        },
        {
          startTime: "09:30",
          endTime: "12:30",
          title: "Главный учебный блок / Самое важное дело",
          category: "study",
          reason: "Максимальный запас силы воли и концентрации",
          badge: "Фокус №1 🚀"
        },
        {
          startTime: "12:30",
          endTime: "14:00",
          title: "Обед, отдых и чтение книги",
          category: "rest",
          reason: "Восстановление сил в середине дня",
          badge: "Обед 🍲"
        },
        {
          startTime: "14:00",
          endTime: "16:30",
          title: "Второй блок: домашка, практика или проект",
          category: "study",
          reason: "Применение знаний на практике",
          badge: "Практика 💻"
        },
        {
          startTime: fixedTime ? `${fixedTime}:00` : "17:00",
          endTime: fixedTime ? `${fixedTime + 1}:30` : "18:30",
          title: hasSport ? "Тренировка и физическая активность" : "Активная прогулка или спортзал",
          category: "sport",
          reason: "Заряд бодрости и тонус мышц",
          badge: "Здоровье 💪"
        },
        {
          startTime: "19:00",
          endTime: "20:30",
          title: "Ужин и подведение итогов дня",
          category: "rest",
          reason: "Анализ прогресса по целям и привычкам",
          badge: "Вечер"
        },
        {
          startTime: "20:30",
          endTime: "22:30",
          title: "Хобби, друзья или любимый фильм",
          category: "rest",
          reason: "Эмоциональное насыщение и качественный отдых",
          badge: "Свободное время 🌟"
        }
      ];
    }

    return {
      headline,
      advice,
      items: planItems
    };
  }

  /**
   * Декомпозиция большой комплексной задачи на подзадачи (шаги)
   */
  async decomposeTask(taskTitle, timeframe, detailLevel) {
    await new Promise(r => setTimeout(r, 650));

    const t = (taskTitle || '').toLowerCase();

    if (t.includes('курсов') || t.includes('диплом') || t.includes('реферат')) {
      return {
        title: "Пошаговый план: " + taskTitle,
        totalTime: "12–15 часов суммарно",
        steps: [
          {
            num: 1,
            title: "Утвердить план и структуру работы (Введение, 3 главы, Заключение)",
            duration: "45 мин",
            badge: "Подготовка",
            category: "study"
          },
          {
            num: 2,
            title: "Найти 8–10 авторитетных источников литературы и составить список",
            duration: "60 мин",
            badge: "Исследование",
            category: "study"
          },
          {
            num: 3,
            title: "Написать Главу 1 (Теоретическая часть и базовые понятия)",
            duration: "120 мин",
            badge: "Теория",
            category: "study"
          },
          {
            num: 4,
            title: "Написать Главу 2 (Практический анализ и расчёты/примеры)",
            duration: "150 мин",
            badge: "Практика",
            category: "study"
          },
          {
            num: 5,
            title: "Сформулировать Введение, Заключение и выводы",
            duration: "45 мин",
            badge: "Выводы",
            category: "study"
          },
          {
            num: 6,
            title: "Оформить по ГОСТу (шрифт, отступы, сноски, титульный лист)",
            duration: "40 мин",
            badge: "Оформление",
            category: "work"
          }
        ]
      };
    } else if (t.includes('олимпиад') || t.includes('экзамен') || t.includes('егэ')) {
      return {
        title: "План подготовки: " + taskTitle,
        totalTime: "По 90 мин в день",
        steps: [
          {
            num: 1,
            title: "Прорешать демонстрационный вариант прошлых лет без подсказок",
            duration: "90 мин",
            badge: "Диагностика",
            category: "study"
          },
          {
            num: 2,
            title: "Выписать темы с ошибками и составить лист слабых мест",
            duration: "30 мин",
            badge: "Анализ",
            category: "study"
          },
          {
            num: 3,
            title: "Углубленный разбор сложной теории по ТОП-3 проблемным темам",
            duration: "60 мин",
            badge: "Теория",
            category: "study"
          },
          {
            num: 4,
            title: "Прорешать блок нестандартных задач повышенной сложности",
            duration: "75 мин",
            badge: "Практика",
            category: "study"
          },
          {
            num: 5,
            title: "Финальный тренировочный тест на время с таймером",
            duration: "90 мин",
            badge: "Контроль",
            category: "study"
          }
        ]
      };
    } else if (t.includes('английск') || t.includes('глагол') || t.includes('b2')) {
      return {
        title: "Пошаговый план изучения: " + taskTitle,
        totalTime: "4 этапа по 30 мин",
        steps: [
          {
            num: 1,
            title: "Разбить список на 4 группы по смысловым паттернам (V1-V2-V3)",
            duration: "25 мин",
            badge: "Систематизация",
            category: "study"
          },
          {
            num: 2,
            title: "Создать интерактивные карточки со звуковым произношением",
            duration: "30 мин",
            badge: "Инструменты",
            category: "study"
          },
          {
            num: 3,
            title: "Составить по 2 личных предложения с каждым новым словом в контексте",
            duration: "45 мин",
            badge: "Контекст",
            category: "study"
          },
          {
            num: 4,
            title: "Блиц-тест на знание 3 форм глаголов с таймером 5 секунд на слово",
            duration: "20 мин",
            badge: "Закрепление",
            category: "study"
          }
        ]
      };
    } else {
      // Универсальная декомпозиция для любой задачи
      return {
        title: "Декомпозиция задачи: " + taskTitle,
        totalTime: "5 простых шагов (~3.5 часа)",
        steps: [
          {
            num: 1,
            title: "Сформулировать точный критерий завершенности (Definition of Done)",
            duration: "20 мин",
            badge: "Целеполагание",
            category: "work"
          },
          {
            num: 2,
            title: "Собрать необходимые материалы, доступы и ссылки в одном месте",
            duration: "30 мин",
            badge: "Сбор базы",
            category: "work"
          },
          {
            num: 3,
            title: "Сделать черновой каркас / прототип (MVP без перфекционизма)",
            duration: "60 мин",
            badge: "Первый результат",
            category: "study"
          },
          {
            num: 4,
            title: "Доработать детали, исправить недочеты и протестировать",
            duration: "50 мин",
            badge: "Полировка",
            category: "work"
          },
          {
            num: 5,
            title: "Финальная проверка, презентация и фиксация в трекере достижений",
            duration: "25 мин",
            badge: "Финал 🎉",
            category: "personal"
          }
        ]
      };
    }
  }
}

const lifeAi = new AiEngine();
