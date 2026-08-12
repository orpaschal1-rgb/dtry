export type ItemStatus = 'pending' | 'completed' | 'failed';

export type ItemType = 'goal' | 'rule';

export type Category = 'fitness' | 'finance' | 'mindset' | 'productivity' | 'health' | 'personal';

export interface DailyItem {
  id: string;
  type: ItemType;
  title: string;
  description?: string;
  category?: Category;
  status: ItemStatus;
  date: string; // YYYY-MM-DD
  recurringRuleId?: string;
  failReason?: string;
  createdAt: string;
}

export interface RecurringRule {
  id: string;
  title: string;
  description?: string;
  category: Category;
  active: boolean;
  createdAt: string;
}

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
}

export interface LongTermGoal {
  id: string;
  title: string;
  description?: string;
  category: Category;
  targetDate?: string;
  hasMetric: boolean;
  currentValue?: number;
  targetValue?: number;
  unit?: string;
  isCompleted: boolean;
  notes?: string;
  milestones: Milestone[];
  createdAt: string;
}

export interface ExtraAchievement {
  id: string;
  title: string;
  category?: Category;
  createdAt: string;
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  reflection?: string;
  rating?: number; // 1 to 5
  extraAchievements?: ExtraAchievement[];
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  autoAddRecurringRules: boolean;
  userName?: string;
  streakCount: number;
}
