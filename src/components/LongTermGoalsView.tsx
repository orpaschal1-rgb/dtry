import React, { useState } from 'react';
import {
  Target,
  Plus,
  CheckCircle2,
  Trash2,
  Edit2,
  TrendingUp,
  Calendar,
  Layers,
  Award,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { LongTermGoal, Category } from '../types';

interface LongTermGoalsViewProps {
  longTermGoals: LongTermGoal[];
  onAddGoal: () => void;
  onEditGoal: (goal: LongTermGoal) => void;
  onDeleteGoal: (goalId: string) => void;
  onToggleMilestone: (goalId: string, milestoneId: string) => void;
  onUpdateMetricValue: (goalId: string, newValue: number) => void;
  onToggleGoalCompleted: (goalId: string) => void;
}

export const LongTermGoalsView: React.FC<LongTermGoalsViewProps> = ({
  longTermGoals,
  onAddGoal,
  onEditGoal,
  onDeleteGoal,
  onToggleMilestone,
  onUpdateMetricValue,
  onToggleGoalCompleted,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingMetricId, setEditingMetricId] = useState<string | null>(null);
  const [metricInputValue, setMetricInputValue] = useState<string>('');

  const filteredGoals = longTermGoals.filter((g) => {
    if (selectedCategory === 'all') return true;
    return g.category === selectedCategory;
  });

  const activeGoalsCount = longTermGoals.filter((g) => !g.isCompleted).length;
  const completedGoalsCount = longTermGoals.filter((g) => g.isCompleted).length;

  const handleStartUpdateMetric = (goal: LongTermGoal) => {
    setEditingMetricId(goal.id);
    setMetricInputValue(goal.currentValue !== undefined ? String(goal.currentValue) : '');
  };

  const handleSaveMetricValue = (goalId: string) => {
    if (metricInputValue !== '') {
      onUpdateMetricValue(goalId, Number(metricInputValue));
    }
    setEditingMetricId(null);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 text-white p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <Target className="w-4 h-4" />
            <span>Actual North Star Targets</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white">
            Long-Term Life Goals
          </h2>
          <p className="text-xs text-zinc-300 max-w-xl">
            Big ambitions like "Get a six pack", "Save $100k money this year", or "Master a skill". Break them down into actionable milestones and daily habits.
          </p>
        </div>

        <button
          onClick={onAddGoal}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Long-Term Goal</span>
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all whitespace-nowrap ${
            selectedCategory === 'all'
              ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 shadow-xs'
              : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50'
          }`}
        >
          All Goals ({longTermGoals.length})
        </button>

        {[
          { id: 'fitness', label: '💪 Fitness & Body' },
          { id: 'finance', label: '💰 Finance & Money' },
          { id: 'productivity', label: '⚡ Productivity' },
          { id: 'mindset', label: '🧠 Mindset' },
          { id: 'health', label: '🥗 Health' },
          { id: 'personal', label: '🌟 Personal' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl font-semibold text-xs transition-all whitespace-nowrap ${
              selectedCategory === cat.id
                ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 shadow-xs'
                : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Goals Cards List */}
      {filteredGoals.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-zinc-900/60 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-3">
          <Target className="w-10 h-10 text-zinc-300 dark:text-zinc-700 mx-auto" />
          <h3 className="font-bold text-zinc-800 dark:text-zinc-200 text-sm">
            No Long-Term Goals in this category yet.
          </h3>
          <p className="text-xs text-zinc-500 max-w-md mx-auto">
            Click "+ Add Long-Term Goal" to set major goals like reaching $100k savings or building your ideal physique.
          </p>
          <button
            onClick={onAddGoal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 font-bold text-xs rounded-xl"
          >
            <Plus className="w-4 h-4" />
            <span>Create Goal</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredGoals.map((goal) => {
            // Calculate progress percentage
            let progressPct = 0;
            if (goal.hasMetric && goal.targetValue && goal.currentValue !== undefined) {
              if (goal.targetValue > 0) {
                progressPct = Math.min(100, Math.max(0, Math.round((goal.currentValue / goal.targetValue) * 100)));
              }
            } else if (goal.milestones && goal.milestones.length > 0) {
              const comp = goal.milestones.filter((m) => m.completed).length;
              progressPct = Math.round((comp / goal.milestones.length) * 100);
            } else if (goal.isCompleted) {
              progressPct = 100;
            }

            return (
              <div
                key={goal.id}
                className={`bg-white dark:bg-zinc-900 rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-2xs ${
                  goal.isCompleted
                    ? 'border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/20 dark:bg-emerald-950/10'
                    : 'border-zinc-200/90 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                <div className="p-5 space-y-4">
                  {/* Category & Status Header */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold tracking-wider uppercase bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                      {goal.category}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onToggleGoalCompleted(goal.id)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                          goal.isCompleted
                            ? 'bg-emerald-600 text-white'
                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-emerald-100 hover:text-emerald-700 dark:hover:bg-emerald-950/60 dark:hover:text-emerald-400'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{goal.isCompleted ? 'Achieved!' : 'Mark Done'}</span>
                      </button>

                      <button
                        onClick={() => onEditGoal(goal)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        title="Edit Goal"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onDeleteGoal(goal.id)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Delete Goal"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Goal Title & Description */}
                  <div className="space-y-1">
                    <h3
                      className={`font-extrabold text-base sm:text-lg leading-snug ${
                        goal.isCompleted
                          ? 'line-through text-emerald-900 dark:text-emerald-200'
                          : 'text-zinc-900 dark:text-zinc-100'
                      }`}
                    >
                      {goal.title}
                    </h3>
                    {goal.description && (
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {goal.description}
                      </p>
                    )}
                  </div>

                  {/* Metric Counter & Progress Bar */}
                  {goal.hasMetric && goal.targetValue !== undefined && (
                    <div className="p-3.5 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200/80 dark:border-zinc-800 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-zinc-600 dark:text-zinc-400 flex items-center gap-1">
                          <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Target Metric</span>
                        </span>

                        {editingMetricId === goal.id ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={metricInputValue}
                              onChange={(e) => setMetricInputValue(e.target.value)}
                              className="w-20 px-2 py-0.5 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-600 rounded text-xs font-bold"
                            />
                            <button
                              onClick={() => handleSaveMetricValue(goal.id)}
                              className="px-2 py-0.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 rounded text-xs font-bold"
                            >
                              Save
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleStartUpdateMetric(goal)}
                            className="font-bold text-zinc-900 dark:text-zinc-100 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors underline decoration-dashed"
                          >
                            {goal.unit === '$'
                              ? `$${(goal.currentValue || 0).toLocaleString()} / $${goal.targetValue.toLocaleString()}`
                              : `${goal.currentValue || 0} ${goal.unit || ''} / ${goal.targetValue} ${goal.unit || ''}`}
                          </button>
                        )}
                      </div>

                      {/* Bar */}
                      <div className="w-full h-2.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${progressPct}%` }}
                          className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                        />
                      </div>
                    </div>
                  )}

                  {/* Milestones Section */}
                  {goal.milestones && goal.milestones.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider block">
                        Milestones ({goal.milestones.filter((m) => m.completed).length}/{goal.milestones.length})
                      </span>
                      <div className="space-y-1.5">
                        {goal.milestones.map((m) => (
                          <button
                            key={m.id}
                            onClick={() => onToggleMilestone(goal.id, m.id)}
                            className={`w-full flex items-center justify-between p-2 rounded-xl border text-xs text-left transition-colors ${
                              m.completed
                                ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/50 text-emerald-900 dark:text-emerald-200'
                                : 'bg-zinc-50 dark:bg-zinc-800/40 border-zinc-200/80 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300'
                            }`}
                          >
                            <span className={m.completed ? 'line-through font-medium' : 'font-medium'}>
                              {m.title}
                            </span>
                            <CheckCircle2
                              className={`w-4 h-4 shrink-0 ${
                                m.completed
                                  ? 'text-emerald-600 dark:text-emerald-400 fill-emerald-100 dark:fill-emerald-950'
                                  : 'text-zinc-300 dark:text-zinc-600'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Notes / Strategy */}
                  {goal.notes && (
                    <div className="p-3 bg-zinc-50 dark:bg-zinc-800/30 rounded-xl text-xs text-zinc-600 dark:text-zinc-400 border border-zinc-200/60 dark:border-zinc-800">
                      <span className="font-bold text-zinc-700 dark:text-zinc-300 block mb-0.5">
                        Strategy Notes:
                      </span>
                      {goal.notes}
                    </div>
                  )}
                </div>

                {/* Footer target date */}
                {goal.targetDate && (
                  <div className="px-5 py-2.5 bg-zinc-50 dark:bg-zinc-800/60 border-t border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Target: {goal.targetDate}</span>
                    </div>
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                      {progressPct}% Progress
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
