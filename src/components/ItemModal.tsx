import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Shield, Target, Award } from 'lucide-react';
import { DailyItem, LongTermGoal, Category, ItemType } from '../types';

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'add-daily' | 'edit-daily' | 'add-long-term' | 'edit-long-term' | 'add-recurring';
  initialDailyItem?: DailyItem | null;
  initialLongTermGoal?: LongTermGoal | null;
  targetDateStr?: string;
  onSaveDailyItem?: (item: Omit<DailyItem, 'id' | 'createdAt'> & { id?: string }) => void;
  onSaveLongTermGoal?: (goal: Omit<LongTermGoal, 'id' | 'createdAt'> & { id?: string }) => void;
  onSaveRecurringRule?: (rule: { title: string; description?: string; category: Category }) => void;
}

export const ItemModal: React.FC<ItemModalProps> = ({
  isOpen,
  onClose,
  mode,
  initialDailyItem,
  initialLongTermGoal,
  targetDateStr,
  onSaveDailyItem,
  onSaveLongTermGoal,
  onSaveRecurringRule,
}) => {
  // Common Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('mindset');
  const [itemType, setItemType] = useState<ItemType>('goal');

  // Long-Term Specific Fields
  const [targetDate, setTargetDate] = useState('');
  const [hasMetric, setHasMetric] = useState(false);
  const [currentValue, setCurrentValue] = useState<number | ''>('');
  const [targetValue, setTargetValue] = useState<number | ''>('');
  const [unit, setUnit] = useState('');
  const [notes, setNotes] = useState('');
  const [milestones, setMilestones] = useState<{ id: string; title: string; completed: boolean }[]>([]);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    if (mode === 'edit-daily' && initialDailyItem) {
      setTitle(initialDailyItem.title);
      setDescription(initialDailyItem.description || '');
      setCategory(initialDailyItem.category || 'mindset');
      setItemType(initialDailyItem.type);
    } else if (mode === 'edit-long-term' && initialLongTermGoal) {
      setTitle(initialLongTermGoal.title);
      setDescription(initialLongTermGoal.description || '');
      setCategory(initialLongTermGoal.category);
      setTargetDate(initialLongTermGoal.targetDate || '');
      setHasMetric(initialLongTermGoal.hasMetric);
      setCurrentValue(initialLongTermGoal.currentValue ?? '');
      setTargetValue(initialLongTermGoal.targetValue ?? '');
      setUnit(initialLongTermGoal.unit || '');
      setNotes(initialLongTermGoal.notes || '');
      setMilestones(initialLongTermGoal.milestones || []);
    } else {
      // Reset defaults
      setTitle('');
      setDescription('');
      setCategory('mindset');
      setItemType(mode === 'add-recurring' ? 'rule' : 'goal');
      setTargetDate('2026-12-31');
      setHasMetric(false);
      setCurrentValue('');
      setTargetValue('');
      setUnit('$');
      setNotes('');
      setMilestones([]);
    }
  }, [isOpen, mode, initialDailyItem, initialLongTermGoal]);

  if (!isOpen) return null;

  const handleAddMilestone = () => {
    if (!newMilestoneTitle.trim()) return;
    setMilestones([
      ...milestones,
      {
        id: `m-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        title: newMilestoneTitle.trim(),
        completed: false,
      },
    ]);
    setNewMilestoneTitle('');
  };

  const handleRemoveMilestone = (id: string) => {
    setMilestones(milestones.filter((m) => m.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (mode === 'add-daily' || mode === 'edit-daily') {
      if (onSaveDailyItem) {
        onSaveDailyItem({
          id: initialDailyItem?.id,
          title: title.trim(),
          description: description.trim() || undefined,
          category,
          type: itemType,
          status: initialDailyItem ? initialDailyItem.status : 'pending',
          date: targetDateStr || initialDailyItem?.date || new Date().toISOString().split('T')[0],
          recurringRuleId: initialDailyItem?.recurringRuleId,
        });
      }
    } else if (mode === 'add-long-term' || mode === 'edit-long-term') {
      if (onSaveLongTermGoal) {
        onSaveLongTermGoal({
          id: initialLongTermGoal?.id,
          title: title.trim(),
          description: description.trim() || undefined,
          category,
          targetDate: targetDate || undefined,
          hasMetric,
          currentValue: hasMetric && currentValue !== '' ? Number(currentValue) : undefined,
          targetValue: hasMetric && targetValue !== '' ? Number(targetValue) : undefined,
          unit: hasMetric ? unit.trim() : undefined,
          isCompleted: initialLongTermGoal?.isCompleted || false,
          notes: notes.trim() || undefined,
          milestones,
        });
      }
    } else if (mode === 'add-recurring') {
      if (onSaveRecurringRule) {
        onSaveRecurringRule({
          title: title.trim(),
          description: description.trim() || undefined,
          category,
        });
      }
    }

    onClose();
  };

  const isLongTerm = mode === 'add-long-term' || mode === 'edit-long-term';
  const isRecurring = mode === 'add-recurring';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-2">
            {isLongTerm ? (
              <Target className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            ) : itemType === 'rule' || isRecurring ? (
              <Shield className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            ) : (
              <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            )}
            <h2 className="font-bold text-zinc-900 dark:text-zinc-100 text-base">
              {mode === 'add-daily' && 'Add New Daily Goal or Rule'}
              {mode === 'edit-daily' && 'Edit Item'}
              {mode === 'add-long-term' && 'New Long-Term Goal'}
              {mode === 'edit-long-term' && 'Edit Long-Term Goal'}
              {mode === 'add-recurring' && 'Create Daily Recurring Rule'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Item Type Selector for Daily Items */}
          {mode === 'add-daily' && (
            <div>
              <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">
                Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setItemType('goal')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-medium text-xs sm:text-sm border transition-all ${
                    itemType === 'goal'
                      ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-300 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-semibold'
                      : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                  }`}
                >
                  <Award className="w-4 h-4 text-blue-500" />
                  <span>Daily Goal / Task</span>
                </button>
                <button
                  type="button"
                  onClick={() => setItemType('rule')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-medium text-xs sm:text-sm border transition-all ${
                    itemType === 'rule'
                      ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-300 font-semibold'
                      : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                  }`}
                >
                  <Shield className="w-4 h-4 text-amber-500" />
                  <span>Daily Rule</span>
                </button>
              </div>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1 uppercase tracking-wider">
              {isLongTerm ? 'Goal Title (e.g., Get a six pack, Save $100k)' : 'Title'} *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                isLongTerm
                  ? 'e.g., Get a six pack or Save $100k'
                  : itemType === 'rule' || isRecurring
                  ? 'e.g., No sugar after 8 PM'
                  : 'e.g., Complete 45-min workout'
              }
              className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1 uppercase tracking-wider">
              Description / Details (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add extra context, rules, or guidelines..."
              className="w-full px-3.5 py-2 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 resize-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1 uppercase tracking-wider">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
            >
              <option value="fitness">💪 Fitness & Body</option>
              <option value="finance">💰 Finance & Money</option>
              <option value="mindset">🧠 Mindset & Discipline</option>
              <option value="productivity">⚡ Productivity & Career</option>
              <option value="health">🥗 Health & Wellness</option>
              <option value="personal">🌟 Personal Development</option>
            </select>
          </div>

          {/* Long-Term Specific Fields */}
          {isLongTerm && (
            <div className="space-y-4 pt-2 border-t border-zinc-200 dark:border-zinc-800">
              {/* Target Date */}
              <div>
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1 uppercase tracking-wider">
                  Target Date
                </label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full px-3.5 py-2 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                />
              </div>

              {/* Metric Tracker Switch */}
              <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-200 dark:border-zinc-800">
                <div>
                  <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 block">
                    Track Metric Number Progress
                  </span>
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    Track numbers like $ saved, bodyfat %, or weight
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={hasMetric}
                  onChange={(e) => setHasMetric(e.target.checked)}
                  className="w-4 h-4 accent-zinc-900 dark:accent-zinc-100 rounded"
                />
              </div>

              {/* Metric Inputs */}
              {hasMetric && (
                <div className="grid grid-cols-3 gap-2 p-3 bg-zinc-100/70 dark:bg-zinc-800/70 rounded-xl border border-zinc-200 dark:border-zinc-700">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-600 dark:text-zinc-400 uppercase">
                      Current Value
                    </label>
                    <input
                      type="number"
                      step="any"
                      placeholder="e.g. 35000"
                      value={currentValue}
                      onChange={(e) => setCurrentValue(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-600 dark:text-zinc-400 uppercase">
                      Target Value
                    </label>
                    <input
                      type="number"
                      step="any"
                      placeholder="e.g. 100000"
                      value={targetValue}
                      onChange={(e) => setTargetValue(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-600 dark:text-zinc-400 uppercase">
                      Unit Symbol
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. $, lbs, %"
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs font-semibold"
                    />
                  </div>
                </div>
              )}

              {/* Milestones Checklist */}
              <div>
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">
                  Key Milestones
                </label>
                <div className="space-y-2 mb-2">
                  {milestones.map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center justify-between gap-2 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs"
                    >
                      <span className="text-zinc-800 dark:text-zinc-200 font-medium">{m.title}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveMilestone(m.id)}
                        className="text-zinc-400 hover:text-red-500 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMilestoneTitle}
                    onChange={(e) => setNewMilestoneTitle(e.target.value)}
                    placeholder="Add a milestone (e.g. Visible abs, $50k saved)"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddMilestone();
                      }
                    }}
                    className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddMilestone}
                    className="px-3 py-1.5 bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-semibold rounded-xl text-xs hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1 uppercase tracking-wider">
                  Strategy / Action Notes
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Key strategies, diet requirements, or guidelines..."
                  className="w-full px-3.5 py-2 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 resize-none"
                />
              </div>
            </div>
          )}

          {/* Modal Actions */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-zinc-200 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              Save Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
