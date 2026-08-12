import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Plus,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Trash2,
  Edit2,
  Shield,
  Award,
  AlertTriangle,
  Sparkles,
  MessageSquare,
  Star,
} from 'lucide-react';
import { DailyItem, ItemStatus, DailyLog } from '../types';
import { formatFriendlyDate, formatDateKey, parseDateKey } from '../lib/storage';

interface TodayViewProps {
  currentDateStr: string;
  setCurrentDateStr: (dateStr: string) => void;
  dailyItems: DailyItem[];
  onUpdateStatus: (itemId: string, status: ItemStatus, failReason?: string) => void;
  onDeleteItem: (itemId: string) => void;
  onEditItem: (item: DailyItem) => void;
  onOpenAddModal: () => void;
  dailyLog?: DailyLog;
  onSaveDailyLog: (dateStr: string, reflection: string, rating: number) => void;
}

export const TodayView: React.FC<TodayViewProps> = ({
  currentDateStr,
  setCurrentDateStr,
  dailyItems,
  onUpdateStatus,
  onDeleteItem,
  onEditItem,
  onOpenAddModal,
  dailyLog,
  onSaveDailyLog,
}) => {
  const [failModalItem, setFailModalItem] = useState<DailyItem | null>(null);
  const [failReasonInput, setFailReasonInput] = useState('');
  const [reflectionInput, setReflectionInput] = useState(dailyLog?.reflection || '');
  const [ratingInput, setRatingInput] = useState(dailyLog?.rating || 4);

  // Filter items for currently selected date
  const itemsForDate = dailyItems.filter((i) => i.date === currentDateStr);
  const rules = itemsForDate.filter((i) => i.type === 'rule');
  const goals = itemsForDate.filter((i) => i.type === 'goal');

  // Stats
  const totalCount = itemsForDate.length;
  const completedCount = itemsForDate.filter((i) => i.status === 'completed').length;
  const failedCount = itemsForDate.filter((i) => i.status === 'failed').length;
  const pendingCount = itemsForDate.filter((i) => i.status === 'pending').length;
  const successRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const isToday = currentDateStr === formatDateKey();

  // Navigation handlers
  const handlePrevDay = () => {
    const d = parseDateKey(currentDateStr);
    d.setDate(d.getDate() - 1);
    setCurrentDateStr(formatDateKey(d));
  };

  const handleNextDay = () => {
    const d = parseDateKey(currentDateStr);
    d.setDate(d.getDate() + 1);
    setCurrentDateStr(formatDateKey(d));
  };

  const handleGoToday = () => {
    setCurrentDateStr(formatDateKey());
  };

  const handleConfirmFail = () => {
    if (failModalItem) {
      onUpdateStatus(failModalItem.id, 'failed', failReasonInput.trim() || undefined);
      setFailModalItem(null);
      setFailReasonInput('');
    }
  };

  const handleSaveReflection = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveDailyLog(currentDateStr, reflectionInput, ratingInput);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Date Header & Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-4 sm:p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xs">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevDay}
            className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors"
            title="Previous Day"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800/60 rounded-xl border border-zinc-200/80 dark:border-zinc-700/80">
            <Calendar className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
            <input
              type="date"
              value={currentDateStr}
              onChange={(e) => e.target.value && setCurrentDateStr(e.target.value)}
              className="bg-transparent font-bold text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none cursor-pointer"
            />
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200">
              {formatFriendlyDate(currentDateStr)}
            </span>
          </div>

          <button
            onClick={handleNextDay}
            className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors"
            title="Next Day"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {!isToday && (
            <button
              onClick={handleGoToday}
              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 transition-colors"
            >
              Today
            </button>
          )}
        </div>

        {/* Add Item Button */}
        <button
          onClick={onOpenAddModal}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>Add Goal or Rule</span>
        </button>
      </div>

      {/* Daily Accountability Dashboard Bar */}
      <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <span>Daily Accountability Score</span>
              {successRate >= 80 && totalCount > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">
                  🔥 High Discipline
                </span>
              )}
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {completedCount} completed, {failedCount} failed, {pendingCount} pending out of {totalCount} total items
            </p>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
              {totalCount > 0 ? `${successRate}%` : '0%'}
            </span>
          </div>
        </div>

        {/* Progress Visual Bar */}
        <div className="w-full h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden flex">
          <div
            style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
            className="h-full bg-emerald-500 transition-all duration-300"
            title={`${completedCount} Completed`}
          />
          <div
            style={{ width: `${totalCount > 0 ? (failedCount / totalCount) * 100 : 0}%` }}
            className="h-full bg-rose-500 transition-all duration-300"
            title={`${failedCount} Failed`}
          />
        </div>
      </div>

      {/* Rules Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400">
              <Shield className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-base">
              Non-Negotiable Rules ({rules.length})
            </h3>
          </div>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            {rules.filter((r) => r.status === 'completed').length}/{rules.length} Held
          </span>
        </div>

        {rules.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-zinc-900/60 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-2">
            <Shield className="w-8 h-8 text-zinc-300 dark:text-zinc-700 mx-auto" />
            <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
              No rules set for this date yet.
            </p>
            <p className="text-[11px] text-zinc-400">
              Add non-negotiable standards like "No sugar", "Cold shower", or "No phone after 10PM".
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2.5">
            {rules.map((rule) => (
              <ItemCard
                key={rule.id}
                item={rule}
                onUpdateStatus={onUpdateStatus}
                onPromptFail={(item) => setFailModalItem(item)}
                onDeleteItem={onDeleteItem}
                onEditItem={onEditItem}
              />
            ))}
          </div>
        )}
      </div>

      {/* Goals / Tasks Section */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400">
              <Award className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-base">
              Daily Goals & Tasks ({goals.length})
            </h3>
          </div>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            {goals.filter((g) => g.status === 'completed').length}/{goals.length} Completed
          </span>
        </div>

        {goals.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-zinc-900/60 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-2">
            <Award className="w-8 h-8 text-zinc-300 dark:text-zinc-700 mx-auto" />
            <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
              No daily tasks set for this date.
            </p>
            <p className="text-[11px] text-zinc-400">
              Add specific targets like "Complete leg workout", "Write 2000 words", or "Review finances".
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2.5">
            {goals.map((goal) => (
              <ItemCard
                key={goal.id}
                item={goal}
                onUpdateStatus={onUpdateStatus}
                onPromptFail={(item) => setFailModalItem(item)}
                onDeleteItem={onDeleteItem}
                onEditItem={onEditItem}
              />
            ))}
          </div>
        )}
      </div>

      {/* Daily Reflection & Notes */}
      <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800/80 pb-3">
          <MessageSquare className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
          <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">
            Daily Reflection & Accountability Log
          </h3>
        </div>

        <form onSubmit={handleSaveReflection} className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
              Day Rating:
            </span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRatingInput(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-4 h-4 ${
                      star <= ratingInput
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-zinc-300 dark:text-zinc-700'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <textarea
            rows={2}
            value={reflectionInput}
            onChange={(e) => setReflectionInput(e.target.value)}
            placeholder="How did today go? What led to any failures or wins? (Auto-saved or press Save)"
            className="w-full p-3 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 resize-none"
          />

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 font-semibold text-xs rounded-xl transition-colors"
            >
              Save Reflection Log
            </button>
          </div>
        </form>
      </div>

      {/* Fail Prompt Modal */}
      {failModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-bold text-base">Mark as Failed</h3>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              Honesty is key to self-discipline. What caused you to miss or break{' '}
              <span className="font-bold text-zinc-900 dark:text-zinc-100">"{failModalItem.title}"</span>?
            </p>
            <input
              type="text"
              value={failReasonInput}
              onChange={(e) => setFailReasonInput(e.target.value)}
              placeholder="e.g., Lack of sleep, gave in to temptation, poor planning..."
              className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setFailModalItem(null)}
                className="px-3.5 py-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmFail}
                className="px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs"
              >
                Confirm Failure
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface ItemCardProps {
  item: DailyItem;
  onUpdateStatus: (itemId: string, status: ItemStatus) => void;
  onPromptFail: (item: DailyItem) => void;
  onDeleteItem: (itemId: string) => void;
  onEditItem: (item: DailyItem) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({
  item,
  onUpdateStatus,
  onPromptFail,
  onDeleteItem,
  onEditItem,
}) => {
  const isCompleted = item.status === 'completed';
  const isFailed = item.status === 'failed';
  const isPending = item.status === 'pending';

  return (
    <div
      className={`p-4 rounded-xl border transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
        isCompleted
          ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-800/50'
          : isFailed
          ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200/80 dark:border-rose-800/50'
          : 'bg-white dark:bg-zinc-900 border-zinc-200/90 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
      }`}
    >
      <div className="flex items-start gap-3 flex-1 min-w-0">
        {/* Status indicator dot / badge */}
        <div className="mt-0.5">
          {item.type === 'rule' ? (
            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-extrabold tracking-wider uppercase bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              Rule
            </span>
          ) : (
            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-extrabold tracking-wider uppercase bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              Goal
            </span>
          )}
        </div>

        <div className="space-y-0.5 min-w-0">
          <h4
            className={`font-semibold text-sm leading-snug break-words ${
              isCompleted
                ? 'line-through text-emerald-900 dark:text-emerald-200'
                : isFailed
                ? 'line-through text-rose-900 dark:text-rose-200'
                : 'text-zinc-900 dark:text-zinc-100'
            }`}
          >
            {item.title}
          </h4>
          {item.description && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
              {item.description}
            </p>
          )}
          {item.failReason && (
            <p className="text-[11px] text-rose-600 dark:text-rose-400 italic">
              Failure note: {item.failReason}
            </p>
          )}
        </div>
      </div>

      {/* Action Buttons: Check Off, Fail, Edit, Delete */}
      <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
        {/* Check Off Button */}
        <button
          onClick={() => onUpdateStatus(item.id, isCompleted ? 'pending' : 'completed')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
            isCompleted
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-zinc-100 dark:bg-zinc-800 hover:bg-emerald-100 dark:hover:bg-emerald-950/60 text-zinc-700 dark:text-zinc-300 hover:text-emerald-700 dark:hover:text-emerald-400'
          }`}
          title={isCompleted ? 'Mark Pending' : 'Mark Completed'}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{isCompleted ? 'Done' : 'Check'}</span>
        </button>

        {/* Fail Button */}
        <button
          onClick={() => (isFailed ? onUpdateStatus(item.id, 'pending') : onPromptFail(item))}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
            isFailed
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-zinc-100 dark:bg-zinc-800 hover:bg-rose-100 dark:hover:bg-rose-950/60 text-zinc-700 dark:text-zinc-300 hover:text-rose-700 dark:hover:text-rose-400'
          }`}
          title={isFailed ? 'Mark Pending' : 'Mark Failed'}
        >
          <XCircle className="w-4 h-4" />
          <span>{isFailed ? 'Failed' : 'Failed'}</span>
        </button>

        {/* Reset Status if done/failed */}
        {(isCompleted || isFailed) && (
          <button
            onClick={() => onUpdateStatus(item.id, 'pending')}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="Reset to Pending"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Edit Button */}
        <button
          onClick={() => onEditItem(item)}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          title="Edit"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>

        {/* Delete Button */}
        <button
          onClick={() => onDeleteItem(item.id)}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
          title="Delete"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
