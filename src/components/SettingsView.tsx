import React, { useState } from 'react';
import {
  Sun,
  Moon,
  Shield,
  Plus,
  Trash2,
  Download,
  Upload,
  RotateCcw,
  Check,
  AlertCircle,
  Monitor,
} from 'lucide-react';
import { RecurringRule, UserSettings, Category } from '../types';

interface SettingsViewProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: UserSettings) => void;
  recurringRules: RecurringRule[];
  onAddRecurringRule: () => void;
  onDeleteRecurringRule: (ruleId: string) => void;
  onToggleRecurringRule: (ruleId: string) => void;
  onExportData: () => void;
  onImportData: (jsonStr: string) => boolean;
  onResetData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  recurringRules,
  onAddRecurringRule,
  onDeleteRecurringRule,
  onToggleRecurringRule,
  onExportData,
  onImportData,
  onResetData,
}) => {
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const ok = onImportData(content);
        if (ok) {
          setImportStatus('Data imported successfully!');
          setTimeout(() => setImportStatus(null), 3000);
        } else {
          setImportStatus('Failed to import file. Invalid format.');
          setTimeout(() => setImportStatus(null), 3000);
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xs space-y-1">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          Settings & Preferences
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Customize your theme, daily rules template, and manage your local data backups.
        </p>
      </div>

      {/* Theme Settings Section */}
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xs space-y-4">
        <div>
          <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-base">
            Appearance & UI Theme
          </h3>
          <p className="text-xs text-zinc-500">
            Choose between clean white light theme, sleek dark theme, or match system preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => onUpdateSettings({ ...settings, theme: 'light' })}
            className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
              settings.theme === 'light'
                ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-800 font-bold shadow-2xs'
                : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <Sun className="w-5 h-5 text-amber-500" />
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                Clean Light UI
              </span>
            </div>
            {settings.theme === 'light' && <Check className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />}
          </button>

          <button
            onClick={() => onUpdateSettings({ ...settings, theme: 'dark' })}
            className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
              settings.theme === 'dark'
                ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-800 font-bold shadow-2xs'
                : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <Moon className="w-5 h-5 text-indigo-400" />
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                Sleek Dark UI
              </span>
            </div>
            {settings.theme === 'dark' && <Check className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />}
          </button>

          <button
            onClick={() => onUpdateSettings({ ...settings, theme: 'system' })}
            className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
              settings.theme === 'system'
                ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-800 font-bold shadow-2xs'
                : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <Monitor className="w-5 h-5 text-zinc-500" />
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                System Default
              </span>
            </div>
            {settings.theme === 'system' && <Check className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />}
          </button>
        </div>
      </div>

      {/* Master Recurring Rules Template Section */}
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-base flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-500" />
              <span>Default Recurring Daily Rules</span>
            </h3>
            <p className="text-xs text-zinc-500">
              These non-negotiables automatically populate every single morning on your daily list.
            </p>
          </div>

          <button
            onClick={onAddRecurringRule}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-bold text-xs rounded-xl shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Recurring Rule</span>
          </button>
        </div>

        <div className="space-y-2.5">
          {recurringRules.map((rule) => (
            <div
              key={rule.id}
              className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-colors ${
                rule.active
                  ? 'bg-zinc-50/70 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-800'
                  : 'bg-zinc-100/50 dark:bg-zinc-900/40 border-zinc-200/50 dark:border-zinc-800/50 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={rule.active}
                  onChange={() => onToggleRecurringRule(rule.id)}
                  className="w-4 h-4 accent-zinc-900 dark:accent-zinc-100 rounded"
                  title="Toggle active state"
                />
                <div>
                  <h4 className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">
                    {rule.title}
                  </h4>
                  {rule.description && (
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                      {rule.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                  {rule.category}
                </span>
                <button
                  onClick={() => onDeleteRecurringRule(rule.id)}
                  className="p-1.5 text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                  title="Delete rule"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data Export / Import / Backup Section */}
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xs space-y-4">
        <div>
          <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-base">
            Data Privacy & Local Backup
          </h3>
          <p className="text-xs text-zinc-500">
            Your data remains 100% private in your browser. You can export a JSON backup file or restore from a previous backup anytime.
          </p>
        </div>

        {importStatus && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold rounded-xl flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{importStatus}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onExportData}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 font-bold text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export JSON Backup</span>
          </button>

          <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 font-bold text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 cursor-pointer transition-colors">
            <Upload className="w-4 h-4" />
            <span>Restore JSON Backup</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Reset Danger Zone */}
        <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset all goals and rules to factory default</span>
            </button>
          ) : (
            <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300 font-bold text-xs">
                <AlertCircle className="w-4 h-4" />
                <span>Are you sure? This will delete custom items and reset defaults.</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onResetData();
                    setShowResetConfirm(false);
                  }}
                  className="px-3.5 py-1.5 bg-rose-600 text-white font-bold text-xs rounded-lg shadow-xs"
                >
                  Yes, Reset Everything
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="px-3.5 py-1.5 bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-semibold text-xs rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
