import React from 'react';
import { DailyItem, DailyLog } from '../types';
import { formatDateKey, formatFriendlyDate, parseDateKey } from '../lib/storage';
import { Calendar, Flame, CheckCircle2, XCircle, Award, Star, ArrowRight } from 'lucide-react';

interface HistoryViewProps {
  dailyItems: DailyItem[];
  dailyLogs: Record<string, DailyLog>;
  onSelectDate: (dateStr: string) => void;
  streakCount: number;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  dailyItems,
  dailyLogs,
  onSelectDate,
  streakCount,
}) => {
  // Generate last 21 days list
  const recentDays: string[] = [];
  const today = new Date();
  for (let i = 0; i < 21; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    recentDays.push(formatDateKey(d));
  }

  // Calculate overall metrics
  const totalCompleted = dailyItems.filter((i) => i.status === 'completed').length;
  const totalFailed = dailyItems.filter((i) => i.status === 'failed').length;
  const totalLogged = totalCompleted + totalFailed;
  const overallSuccessRate = totalLogged > 0 ? Math.round((totalCompleted / totalLogged) * 100) : 0;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Overview Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xs space-y-1">
          <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold text-xs">
            <Flame className="w-4 h-4 fill-amber-500" />
            <span>Current Streak</span>
          </div>
          <div className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
            {streakCount} Days
          </div>
          <p className="text-[11px] text-zinc-500">Unbroken discipline</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xs space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
            <CheckCircle2 className="w-4 h-4" />
            <span>Success Rate</span>
          </div>
          <div className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
            {overallSuccessRate}%
          </div>
          <p className="text-[11px] text-zinc-500">Completed vs Failed</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xs space-y-1">
          <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold text-xs">
            <Award className="w-4 h-4" />
            <span>Total Completed</span>
          </div>
          <div className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
            {totalCompleted}
          </div>
          <p className="text-[11px] text-zinc-500">Goals & rules executed</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xs space-y-1">
          <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-bold text-xs">
            <XCircle className="w-4 h-4" />
            <span>Total Failed</span>
          </div>
          <div className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
            {totalFailed}
          </div>
          <p className="text-[11px] text-zinc-500">Honest failure logs</p>
        </div>
      </div>

      {/* History Timeline */}
      <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-base">
              Daily Discipline History (Last 21 Days)
            </h3>
            <p className="text-xs text-zinc-500">
              Click any date to view or edit goals, rules, and reflections for that day.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {recentDays.map((dateStr) => {
            const dayItems = dailyItems.filter((i) => i.date === dateStr);
            const comp = dayItems.filter((i) => i.status === 'completed').length;
            const fail = dayItems.filter((i) => i.status === 'failed').length;
            const total = dayItems.length;
            const rate = total > 0 ? Math.round((comp / total) * 100) : 0;
            const log = dailyLogs[dateStr];

            const isToday = dateStr === formatDateKey();

            return (
              <button
                key={dateStr}
                onClick={() => onSelectDate(dateStr)}
                className={`p-4 rounded-xl border text-left transition-all hover:scale-[1.01] flex flex-col justify-between space-y-2 ${
                  isToday
                    ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-800/80 shadow-xs'
                    : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100">
                    {formatFriendlyDate(dateStr)}
                    {isToday && <span className="ml-1 text-emerald-600 dark:text-emerald-400">(Today)</span>}
                  </span>
                  {log?.rating && (
                    <div className="flex items-center gap-0.5">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span className="text-[10px] font-bold text-zinc-700 dark:text-zinc-300">
                        {log.rating}/5
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-zinc-500">
                    <span>{comp} Completed</span>
                    {fail > 0 && <span className="text-rose-500 font-semibold">{fail} Failed</span>}
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden flex">
                    <div
                      style={{ width: `${total > 0 ? (comp / total) * 100 : 0}%` }}
                      className="h-full bg-emerald-500"
                    />
                    <div
                      style={{ width: `${total > 0 ? (fail / total) * 100 : 0}%` }}
                      className="h-full bg-rose-500"
                    />
                  </div>
                </div>

                {log?.reflection && (
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 italic line-clamp-1">
                    "{log.reflection}"
                  </p>
                )}

                <div className="flex items-center justify-end text-[10px] font-bold text-zinc-400 group-hover:text-zinc-800 pt-1">
                  <span>View Details</span>
                  <ArrowRight className="w-3 h-3 ml-1" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
