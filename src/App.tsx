import React, { useState, useEffect } from 'react';
import {
  DailyItem,
  RecurringRule,
  LongTermGoal,
  DailyLog,
  ExtraAchievement,
  UserSettings,
  ItemStatus,
  Category,
} from './types';
import {
  formatDateKey,
  getStoredDailyItems,
  saveStoredDailyItems,
  getStoredRecurringRules,
  saveStoredRecurringRules,
  getStoredLongTermGoals,
  saveStoredLongTermGoals,
  getStoredDailyLogs,
  saveStoredDailyLogs,
  getStoredSettings,
  saveStoredSettings,
  ensureTodayRulesPopulated,
  calculateCurrentStreak,
  exportAllDataJSON,
  importAllDataJSON,
  resetAllDataToDefault,
} from './lib/storage';
import { Navbar } from './components/Navbar';
import { TodayView } from './components/TodayView';
import { LongTermGoalsView } from './components/LongTermGoalsView';
import { HistoryView } from './components/HistoryView';
import { SettingsView } from './components/SettingsView';
import { ItemModal } from './components/ItemModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<'today' | 'longTerm' | 'history' | 'settings'>('today');
  const [currentDateStr, setCurrentDateStr] = useState<string>(formatDateKey());

  // Data States
  const [dailyItems, setDailyItems] = useState<DailyItem[]>([]);
  const [recurringRules, setRecurringRules] = useState<RecurringRule[]>([]);
  const [longTermGoals, setLongTermGoals] = useState<LongTermGoal[]>([]);
  const [dailyLogs, setDailyLogs] = useState<Record<string, DailyLog>>({});
  const [settings, setSettings] = useState<UserSettings>(getStoredSettings());

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<
    'add-daily' | 'edit-daily' | 'add-long-term' | 'edit-long-term' | 'add-recurring'
  >('add-daily');
  const [editingDailyItem, setEditingDailyItem] = useState<DailyItem | null>(null);
  const [editingLongTermGoal, setEditingLongTermGoal] = useState<LongTermGoal | null>(null);

  // Initialize and load stored data
  useEffect(() => {
    setRecurringRules(getStoredRecurringRules());
    setLongTermGoals(getStoredLongTermGoals());
    setDailyLogs(getStoredDailyLogs());
    setSettings(getStoredSettings());
  }, []);

  // Update daily items on date change or initial load
  useEffect(() => {
    const updatedDaily = ensureTodayRulesPopulated(currentDateStr);
    setDailyItems(updatedDaily);
  }, [currentDateStr]);

  // Apply Theme Changes (Dark Mode vs Light Mode)
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else if (settings.theme === 'light') {
      root.classList.remove('dark');
    } else {
      // System default
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [settings.theme]);

  // Helper to toggle theme quickly from navbar
  const handleToggleTheme = () => {
    const newTheme = settings.theme === 'dark' ? 'light' : 'dark';
    const updated = { ...settings, theme: newTheme as 'light' | 'dark' };
    setSettings(updated);
    saveStoredSettings(updated);
  };

  // Daily Item CRUD
  const handleUpdateItemStatus = (itemId: string, newStatus: ItemStatus, failReason?: string) => {
    const updated = dailyItems.map((item) => {
      if (item.id === itemId) {
        return {
          ...item,
          status: newStatus,
          failReason: newStatus === 'failed' ? failReason || item.failReason : undefined,
        };
      }
      return item;
    });
    setDailyItems(updated);
    saveStoredDailyItems(updated);
  };

  const handleDeleteDailyItem = (itemId: string) => {
    const updated = dailyItems.filter((item) => item.id !== itemId);
    setDailyItems(updated);
    saveStoredDailyItems(updated);
  };

  const handleSaveDailyItem = (
    itemData: Omit<DailyItem, 'id' | 'createdAt'> & { id?: string }
  ) => {
    let updated: DailyItem[];
    if (itemData.id) {
      // Edit
      updated = dailyItems.map((item) =>
        item.id === itemData.id
          ? ({
              ...item,
              ...itemData,
            } as DailyItem)
          : item
      );
    } else {
      // Add
      const newItem: DailyItem = {
        id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        title: itemData.title,
        description: itemData.description,
        category: itemData.category,
        type: itemData.type,
        status: itemData.status,
        date: itemData.date,
        createdAt: new Date().toISOString(),
      };
      updated = [...dailyItems, newItem];
    }
    setDailyItems(updated);
    saveStoredDailyItems(updated);
  };

  // Long-Term Goal CRUD
  const handleSaveLongTermGoal = (
    goalData: Omit<LongTermGoal, 'id' | 'createdAt'> & { id?: string }
  ) => {
    let updated: LongTermGoal[];
    if (goalData.id) {
      updated = longTermGoals.map((g) =>
        g.id === goalData.id
          ? ({
              ...g,
              ...goalData,
            } as LongTermGoal)
          : g
      );
    } else {
      const newGoal: LongTermGoal = {
        id: `ltg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        title: goalData.title,
        description: goalData.description,
        category: goalData.category,
        targetDate: goalData.targetDate,
        hasMetric: goalData.hasMetric,
        currentValue: goalData.currentValue,
        targetValue: goalData.targetValue,
        unit: goalData.unit,
        isCompleted: false,
        notes: goalData.notes,
        milestones: goalData.milestones,
        createdAt: new Date().toISOString(),
      };
      updated = [...longTermGoals, newGoal];
    }
    setLongTermGoals(updated);
    saveStoredLongTermGoals(updated);
  };

  const handleDeleteLongTermGoal = (goalId: string) => {
    const updated = longTermGoals.filter((g) => g.id !== goalId);
    setLongTermGoals(updated);
    saveStoredLongTermGoals(updated);
  };

  const handleToggleMilestone = (goalId: string, milestoneId: string) => {
    const updated = longTermGoals.map((g) => {
      if (g.id === goalId) {
        const updatedMilestones = g.milestones.map((m) =>
          m.id === milestoneId ? { ...m, completed: !m.completed } : m
        );
        return { ...g, milestones: updatedMilestones };
      }
      return g;
    });
    setLongTermGoals(updated);
    saveStoredLongTermGoals(updated);
  };

  const handleUpdateMetricValue = (goalId: string, newValue: number) => {
    const updated = longTermGoals.map((g) => {
      if (g.id === goalId) {
        const isComp = g.targetValue !== undefined && newValue >= g.targetValue;
        return { ...g, currentValue: newValue, isCompleted: isComp };
      }
      return g;
    });
    setLongTermGoals(updated);
    saveStoredLongTermGoals(updated);
  };

  const handleToggleGoalCompleted = (goalId: string) => {
    const updated = longTermGoals.map((g) => {
      if (g.id === goalId) {
        return { ...g, isCompleted: !g.isCompleted };
      }
      return g;
    });
    setLongTermGoals(updated);
    saveStoredLongTermGoals(updated);
  };

  // Recurring Rules CRUD
  const handleSaveRecurringRule = (ruleData: {
    title: string;
    description?: string;
    category: Category;
  }) => {
    const newRule: RecurringRule = {
      id: `rule-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: ruleData.title,
      description: ruleData.description,
      category: ruleData.category,
      active: true,
      createdAt: new Date().toISOString(),
    };
    const updated = [...recurringRules, newRule];
    setRecurringRules(updated);
    saveStoredRecurringRules(updated);
  };

  const handleDeleteRecurringRule = (ruleId: string) => {
    const updated = recurringRules.filter((r) => r.id !== ruleId);
    setRecurringRules(updated);
    saveStoredRecurringRules(updated);
  };

  const handleToggleRecurringRule = (ruleId: string) => {
    const updated = recurringRules.map((r) =>
      r.id === ruleId ? { ...r, active: !r.active } : r
    );
    setRecurringRules(updated);
    saveStoredRecurringRules(updated);
  };

  // Daily Log Reflection & Extra Achievements
  const handleSaveDailyLog = (dateStr: string, reflection: string, rating: number) => {
    const existing = dailyLogs[dateStr] || { date: dateStr };
    const updated = {
      ...dailyLogs,
      [dateStr]: { ...existing, date: dateStr, reflection, rating },
    };
    setDailyLogs(updated);
    saveStoredDailyLogs(updated);
  };

  const handleAddExtraAchievement = (dateStr: string, title: string, category?: Category) => {
    const existing = dailyLogs[dateStr] || { date: dateStr };
    const currentList = existing.extraAchievements || [];
    const newAch: ExtraAchievement = {
      id: `ach-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title,
      category,
      createdAt: new Date().toISOString(),
    };
    const updated = {
      ...dailyLogs,
      [dateStr]: {
        ...existing,
        extraAchievements: [...currentList, newAch],
      },
    };
    setDailyLogs(updated);
    saveStoredDailyLogs(updated);
  };

  const handleDeleteExtraAchievement = (dateStr: string, achievementId: string) => {
    const existing = dailyLogs[dateStr];
    if (!existing || !existing.extraAchievements) return;
    const updatedList = existing.extraAchievements.filter((a) => a.id !== achievementId);
    const updated = {
      ...dailyLogs,
      [dateStr]: {
        ...existing,
        extraAchievements: updatedList,
      },
    };
    setDailyLogs(updated);
    saveStoredDailyLogs(updated);
  };

  // Modal Trigger Handlers
  const openAddDailyModal = () => {
    setModalMode('add-daily');
    setEditingDailyItem(null);
    setIsModalOpen(true);
  };

  const openEditDailyModal = (item: DailyItem) => {
    setModalMode('edit-daily');
    setEditingDailyItem(item);
    setIsModalOpen(true);
  };

  const openAddLongTermModal = () => {
    setModalMode('add-long-term');
    setEditingLongTermGoal(null);
    setIsModalOpen(true);
  };

  const openEditLongTermModal = (goal: LongTermGoal) => {
    setModalMode('edit-long-term');
    setEditingLongTermGoal(goal);
    setIsModalOpen(true);
  };

  const openAddRecurringModal = () => {
    setModalMode('add-recurring');
    setIsModalOpen(true);
  };

  // Data Reset & Import
  const handleResetAllData = () => {
    resetAllDataToDefault();
    setDailyItems(getStoredDailyItems());
    setRecurringRules(getStoredRecurringRules());
    setLongTermGoals(getStoredLongTermGoals());
    setDailyLogs(getStoredDailyLogs());
    setSettings(getStoredSettings());
  };

  const handleExportData = () => {
    const jsonStr = exportAllDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `goals-and-rules-backup-${formatDateKey()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (jsonStr: string): boolean => {
    const success = importAllDataJSON(jsonStr);
    if (success) {
      setDailyItems(getStoredDailyItems());
      setRecurringRules(getStoredRecurringRules());
      setLongTermGoals(getStoredLongTermGoals());
      setDailyLogs(getStoredDailyLogs());
      setSettings(getStoredSettings());
    }
    return success;
  };

  const liveStreak = calculateCurrentStreak(dailyItems);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-200 font-sans selection:bg-zinc-900 selection:text-white dark:selection:bg-zinc-100 dark:selection:text-zinc-950">
      {/* Sticky Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={settings.theme}
        toggleTheme={handleToggleTheme}
        streakCount={liveStreak}
      />

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        {activeTab === 'today' && (
          <TodayView
            currentDateStr={currentDateStr}
            setCurrentDateStr={setCurrentDateStr}
            dailyItems={dailyItems}
            onUpdateStatus={handleUpdateItemStatus}
            onDeleteItem={handleDeleteDailyItem}
            onEditItem={openEditDailyModal}
            onOpenAddModal={openAddDailyModal}
            dailyLog={dailyLogs[currentDateStr]}
            onSaveDailyLog={handleSaveDailyLog}
            onAddExtraAchievement={handleAddExtraAchievement}
            onDeleteExtraAchievement={handleDeleteExtraAchievement}
          />
        )}

        {activeTab === 'longTerm' && (
          <LongTermGoalsView
            longTermGoals={longTermGoals}
            onAddGoal={openAddLongTermModal}
            onEditGoal={openEditLongTermModal}
            onDeleteGoal={handleDeleteLongTermGoal}
            onToggleMilestone={handleToggleMilestone}
            onUpdateMetricValue={handleUpdateMetricValue}
            onToggleGoalCompleted={handleToggleGoalCompleted}
          />
        )}

        {activeTab === 'history' && (
          <HistoryView
            dailyItems={dailyItems}
            dailyLogs={dailyLogs}
            onSelectDate={(dateStr) => {
              setCurrentDateStr(dateStr);
              setActiveTab('today');
            }}
            streakCount={liveStreak}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            settings={settings}
            onUpdateSettings={(newSettings) => {
              setSettings(newSettings);
              saveStoredSettings(newSettings);
            }}
            recurringRules={recurringRules}
            onAddRecurringRule={openAddRecurringModal}
            onDeleteRecurringRule={handleDeleteRecurringRule}
            onToggleRecurringRule={handleToggleRecurringRule}
            onExportData={handleExportData}
            onImportData={handleImportData}
            onResetData={handleResetAllData}
          />
        )}
      </main>

      {/* Shared Reusable Modal */}
      <ItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        initialDailyItem={editingDailyItem}
        initialLongTermGoal={editingLongTermGoal}
        targetDateStr={currentDateStr}
        onSaveDailyItem={handleSaveDailyItem}
        onSaveLongTermGoal={handleSaveLongTermGoal}
        onSaveRecurringRule={handleSaveRecurringRule}
      />
    </div>
  );
}
