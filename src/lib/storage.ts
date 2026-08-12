import { DailyItem, RecurringRule, LongTermGoal, DailyLog, UserSettings } from '../types';

const STORAGE_KEYS = {
  DAILY_ITEMS: 'drg_daily_items_v1',
  RECURRING_RULES: 'drg_recurring_rules_v1',
  LONG_TERM_GOALS: 'drg_long_term_goals_v1',
  DAILY_LOGS: 'drg_daily_logs_v1',
  SETTINGS: 'drg_settings_v1',
  INITIALIZED_DATES: 'drg_initialized_dates_v1',
};

// Helper: Format date as YYYY-MM-DD in local time
export function formatDateKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseDateKey(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function formatFriendlyDate(dateStr: string): string {
  const today = formatDateKey(new Date());
  const yesterday = formatDateKey(new Date(Date.now() - 86400000));
  const tomorrow = formatDateKey(new Date(Date.now() + 86400000));

  if (dateStr === today) return 'Today';
  if (dateStr === yesterday) return 'Yesterday';
  if (dateStr === tomorrow) return 'Tomorrow';

  const date = parseDateKey(dateStr);
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// Initial Default Seed Data
const DEFAULT_RECURRING_RULES: RecurringRule[] = [
  {
    id: 'rule-1',
    title: 'No phone for 30 minutes after waking up',
    description: 'Keep morning clear of instant dopamine and focus on morning routine.',
    category: 'mindset',
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'rule-2',
    title: 'Drink 3L of water daily',
    description: 'Stay hydrated throughout the day.',
    category: 'health',
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'rule-3',
    title: 'No junk food or sugary drinks',
    description: 'Fuel the body with high quality nutrients.',
    category: 'fitness',
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'rule-4',
    title: 'Read at least 15 minutes',
    description: 'Consistent learning and knowledge accumulation.',
    category: 'productivity',
    active: true,
    createdAt: new Date().toISOString(),
  },
];

const DEFAULT_LONG_TERM_GOALS: LongTermGoal[] = [
  {
    id: 'ltg-1',
    title: 'Get a Six Pack & Reach 12% Body Fat',
    description: 'Consistent strength training, calorie control, daily rules execution.',
    category: 'fitness',
    targetDate: '2026-12-31',
    hasMetric: true,
    currentValue: 18,
    targetValue: 12,
    unit: '% Body Fat',
    isCompleted: false,
    notes: 'Prioritize protein, 4x gym sessions a week, zero alcohol during cuts.',
    milestones: [
      { id: 'm1', title: 'Complete 30 days unbroken clean diet', completed: true },
      { id: 'm2', title: 'Visible top two ab outline in lighting', completed: false },
      { id: 'm3', title: 'Reach sub-14% bodyfat threshold', completed: false },
      { id: 'm4', title: 'Full 6-pack visible unclenched', completed: false },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ltg-2',
    title: 'Reach $100,000 Net Worth / Savings',
    description: 'Focus on high income skills, strict budgeting, and disciplined investing.',
    category: 'finance',
    targetDate: '2026-12-31',
    hasMetric: true,
    currentValue: 35000,
    targetValue: 100000,
    unit: '$',
    isCompleted: false,
    notes: 'Save $4,000 per month and build income stream.',
    milestones: [
      { id: 'm21', title: 'Hit $25,000 emergency fund benchmark', completed: true },
      { id: 'm22', title: 'Hit $50,000 total balance', completed: false },
      { id: 'm23', title: 'Hit $75,000 balance', completed: false },
      { id: 'm24', title: 'Cross $100,000 total milestone', completed: false },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ltg-3',
    title: 'Master Daily Deep Focus Habits',
    description: 'Eliminate distracting phone habits and maintain a rock-solid work discipline.',
    category: 'productivity',
    targetDate: '2026-10-01',
    hasMetric: false,
    isCompleted: false,
    notes: 'Use 90-minute uninterrupted focus blocks.',
    milestones: [
      { id: 'm31', title: 'Build clean desk setup', completed: true },
      { id: 'm32', title: 'Maintain 14-day rule streak without failure', completed: false },
    ],
    createdAt: new Date().toISOString(),
  },
];

const DEFAULT_SETTINGS: UserSettings = {
  theme: 'light',
  autoAddRecurringRules: true,
  streakCount: 3,
};

// Storage Load & Save Wrappers
export function getStoredDailyItems(): DailyItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.DAILY_ITEMS);
    if (!data) return [];
    return JSON.parse(data);
  } catch (e) {
    console.error('Error loading daily items:', e);
    return [];
  }
}

export function saveStoredDailyItems(items: DailyItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.DAILY_ITEMS, JSON.stringify(items));
  } catch (e) {
    console.error('Error saving daily items:', e);
  }
}

export function getStoredRecurringRules(): RecurringRule[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.RECURRING_RULES);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.RECURRING_RULES, JSON.stringify(DEFAULT_RECURRING_RULES));
      return DEFAULT_RECURRING_RULES;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error('Error loading recurring rules:', e);
    return DEFAULT_RECURRING_RULES;
  }
}

export function saveStoredRecurringRules(rules: RecurringRule[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.RECURRING_RULES, JSON.stringify(rules));
  } catch (e) {
    console.error('Error saving recurring rules:', e);
  }
}

export function getStoredLongTermGoals(): LongTermGoal[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.LONG_TERM_GOALS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.LONG_TERM_GOALS, JSON.stringify(DEFAULT_LONG_TERM_GOALS));
      return DEFAULT_LONG_TERM_GOALS;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error('Error loading long term goals:', e);
    return DEFAULT_LONG_TERM_GOALS;
  }
}

export function saveStoredLongTermGoals(goals: LongTermGoal[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.LONG_TERM_GOALS, JSON.stringify(goals));
  } catch (e) {
    console.error('Error saving long term goals:', e);
  }
}

export function getStoredDailyLogs(): Record<string, DailyLog> {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.DAILY_LOGS);
    if (!data) return {};
    return JSON.parse(data);
  } catch (e) {
    console.error('Error loading daily logs:', e);
    return {};
  }
}

export function saveStoredDailyLogs(logs: Record<string, DailyLog>): void {
  try {
    localStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(logs));
  } catch (e) {
    console.error('Error saving daily logs:', e);
  }
}

export function calculateCurrentStreak(dailyItems: DailyItem[] = getStoredDailyItems()): number {
  const itemsByDate: Record<string, DailyItem[]> = {};
  dailyItems.forEach((item) => {
    if (!itemsByDate[item.date]) itemsByDate[item.date] = [];
    itemsByDate[item.date].push(item);
  });

  let streak = 0;
  const now = new Date();
  const todayKey = formatDateKey(now);

  // Check today first
  const todayItems = itemsByDate[todayKey] || [];
  const todayCompleted = todayItems.filter((i) => i.status === 'completed').length;
  const todayFailed = todayItems.filter((i) => i.status === 'failed').length;

  if (todayCompleted > 0 && todayFailed === 0) {
    streak += 1;
  }

  // Count backwards from yesterday
  let checkDate = new Date(now.valueOf() - 86400000);
  while (true) {
    const key = formatDateKey(checkDate);
    const dayItems = itemsByDate[key];

    if (!dayItems || dayItems.length === 0) {
      break;
    }

    const completed = dayItems.filter((i) => i.status === 'completed').length;
    const failed = dayItems.filter((i) => i.status === 'failed').length;

    if (completed > 0 && failed === 0) {
      streak += 1;
      checkDate = new Date(checkDate.valueOf() - 86400000);
    } else {
      break;
    }
  }

  // Fallback to saved setting streak if user has a custom streak set higher
  const settings = getStoredSettings();
  return Math.max(streak, settings.streakCount || 0);
}

export function getStoredSettings(): UserSettings {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
      return DEFAULT_SETTINGS;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error('Error loading settings:', e);
    return DEFAULT_SETTINGS;
  }
}

export function saveStoredSettings(settings: UserSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving settings:', e);
  }
}

export function getStoredInitializedDates(): string[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.INITIALIZED_DATES);
    if (!data) return [];
    return JSON.parse(data);
  } catch (e) {
    console.error('Error loading initialized dates:', e);
    return [];
  }
}

export function saveStoredInitializedDates(dates: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.INITIALIZED_DATES, JSON.stringify(dates));
  } catch (e) {
    console.error('Error saving initialized dates:', e);
  }
}

// Auto-seed today's recurring rules if they haven't been added yet
export function ensureTodayRulesPopulated(targetDateStr: string = formatDateKey()): DailyItem[] {
  const allDailyItems = getStoredDailyItems();
  const initializedDates = getStoredInitializedDates();

  // If this date was already initialized by the user, do NOT re-insert rules that were modified or deleted
  if (initializedDates.includes(targetDateStr)) {
    return allDailyItems;
  }

  // Mark this date as initialized
  const updatedInitialized = Array.from(new Set([...initializedDates, targetDateStr]));
  saveStoredInitializedDates(updatedInitialized);

  const itemsForDate = allDailyItems.filter((i) => i.date === targetDateStr);
  const recurringRules = getStoredRecurringRules().filter((r) => r.active);

  // Check if recurring rules already exist for target date
  let modified = false;
  const newItems = [...allDailyItems];

  recurringRules.forEach((rule) => {
    const exists = itemsForDate.some((item) => item.recurringRuleId === rule.id || (item.title === rule.title && item.type === 'rule'));
    if (!exists) {
      const newItem: DailyItem = {
        id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        type: 'rule',
        title: rule.title,
        description: rule.description,
        category: rule.category,
        status: 'pending',
        date: targetDateStr,
        recurringRuleId: rule.id,
        createdAt: new Date().toISOString(),
      };
      newItems.push(newItem);
      modified = true;
    }
  });

  if (modified) {
    saveStoredDailyItems(newItems);
    return newItems;
  }

  return allDailyItems;
}

// Export / Import helper
export function exportAllDataJSON(): string {
  const payload = {
    dailyItems: getStoredDailyItems(),
    recurringRules: getStoredRecurringRules(),
    longTermGoals: getStoredLongTermGoals(),
    dailyLogs: getStoredDailyLogs(),
    settings: getStoredSettings(),
    exportedAt: new Date().toISOString(),
  };
  return JSON.stringify(payload, null, 2);
}

export function importAllDataJSON(jsonStr: string): boolean {
  try {
    const parsed = JSON.parse(jsonStr);
    if (parsed.dailyItems && Array.isArray(parsed.dailyItems)) {
      saveStoredDailyItems(parsed.dailyItems);
    }
    if (parsed.recurringRules && Array.isArray(parsed.recurringRules)) {
      saveStoredRecurringRules(parsed.recurringRules);
    }
    if (parsed.longTermGoals && Array.isArray(parsed.longTermGoals)) {
      saveStoredLongTermGoals(parsed.longTermGoals);
    }
    if (parsed.dailyLogs) {
      saveStoredDailyLogs(parsed.dailyLogs);
    }
    if (parsed.settings) {
      saveStoredSettings(parsed.settings);
    }
    return true;
  } catch (e) {
    console.error('Import failed:', e);
    return false;
  }
}

export function resetAllDataToDefault(): void {
  localStorage.removeItem(STORAGE_KEYS.DAILY_ITEMS);
  localStorage.removeItem(STORAGE_KEYS.INITIALIZED_DATES);
  localStorage.setItem(STORAGE_KEYS.RECURRING_RULES, JSON.stringify(DEFAULT_RECURRING_RULES));
  localStorage.setItem(STORAGE_KEYS.LONG_TERM_GOALS, JSON.stringify(DEFAULT_LONG_TERM_GOALS));
  localStorage.removeItem(STORAGE_KEYS.DAILY_LOGS);
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
}
