import React, { useRef, useState } from 'react';
import { Journey } from '../types/journey';
import {
  Settings,
  HardDrive,
  Download,
  Upload,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Check,
  AlertCircle,
} from 'lucide-react';
import { ALL_SAMPLE_JOURNEYS, saveJourneysToStorage } from '../utils/journeyStore';

interface SettingsViewProps {
  journeys: Journey[];
  onReloadJourneys: (journeys: Journey[]) => void;
  isDark?: boolean;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  journeys,
  onReloadJourneys,
  isDark = true,
}) => {
  const [notice, setNotice] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const confirmResetToSamples = () => {
    const defaultSamples = Object.values(ALL_SAMPLE_JOURNEYS);
    saveJourneysToStorage(defaultSamples);
    onReloadJourneys(defaultSamples);
    setShowResetConfirmModal(false);
    setNotice('Reset to initial sample templates successfully.');
    setTimeout(() => setNotice(null), 3500);
  };

  const handleExportAllBackup = () => {
    const blob = new Blob([JSON.stringify(journeys, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `journeyx_workspace_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setNotice('Full workspace exported to JSON.');
    setTimeout(() => setNotice(null), 3000);
  };

  const handleImportJSON = (file: File) => {
    setErrorMessage(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        if (Array.isArray(parsed)) {
          saveJourneysToStorage(parsed);
          onReloadJourneys(parsed);
          setNotice(`Imported ${parsed.length} journeys successfully.`);
        } else if (parsed && parsed.title && parsed.stages) {
          const merged = [...journeys, parsed];
          saveJourneysToStorage(merged);
          onReloadJourneys(merged);
          setNotice(`Imported "${parsed.title}" successfully.`);
        } else {
          throw new Error('Unrecognized Journey JSON format.');
        }
        setTimeout(() => setNotice(null), 3500);
      } catch (err: any) {
        setErrorMessage('Invalid JSON file. Please provide a valid JourneyX export.');
        setTimeout(() => setErrorMessage(null), 4000);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Settings className="w-5 h-5 text-purple-400" />
          <span>Workspace Settings & Data Management</span>
        </h2>
        <p className="text-xs text-slate-400">
          Manage local storage persistence, backups, imports, and AI architecture preferences
        </p>
      </div>

      {notice && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-800/50 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{notice}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-800/50 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
          <span className="font-bold">Error:</span>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Persistence Architecture Explanation */}
      <div className={`p-6 sm:p-7 rounded-3xl glass-panel relative overflow-hidden transition-all ${
        isDark ? 'text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
      }`}>
        <div className="flex items-center gap-2.5 mb-2">
          <HardDrive className="w-5 h-5 text-cyan-400" />
          <h3 className="text-base font-bold">Data Storage & Cross-Device Synchronization</h3>
        </div>
        <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
          <p>
            <strong>How your projects are saved:</strong> All customer journeys, custom touchpoints, pain points, and logged actual KPIs are persistently stored in your browser's secure <strong>Local Storage</strong>.
          </p>
          <p className="text-slate-400">
            Saved projects remain private on this browser and device without transmitting unencrypted telemetry to third-party databases. To synchronize journeys across separate computers or share them with teammates, use the <strong>Export JSON</strong> and <strong>Import JSON</strong> controls below.
          </p>
        </div>

        <div className="mt-5 pt-5 border-t border-white/[0.08] flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleExportAllBackup}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold animated-gradient-active text-white flex items-center gap-1.5 shadow-md shadow-purple-600/30 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Full Workspace Backup (JSON)</span>
          </button>

          <input
            type="file"
            ref={fileInputRef}
            accept=".json"
            onChange={(e) => e.target.files && e.target.files[0] && handleImportJSON(e.target.files[0])}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 border border-white/[0.1] flex items-center gap-1.5 transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import Journey from JSON</span>
          </button>

          <button
            type="button"
            onClick={() => setShowResetConfirmModal(true)}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/[0.04] hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 border border-white/[0.08] hover:border-rose-800/50 flex items-center gap-1.5 transition-colors sm:ml-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Default Templates</span>
          </button>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md p-6 rounded-3xl glass-panel border border-rose-500/30 text-white space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-rose-300 flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-rose-400" />
              Reset Workspace to Default Templates?
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              This will reset all journeys back to the 7 default enterprise sample templates. Any unsaved custom journey modifications will be replaced.
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirmModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/[0.06] hover:bg-white/[0.1] text-slate-300 border border-white/[0.1]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmResetToSamples}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-900/50"
              >
                Yes, Reset Workspace
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Engine & System Specifications */}
      <div className={`p-6 rounded-3xl border ${
        isDark ? 'bg-slate-900/90 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
      }`}>
        <div className="flex items-center gap-2.5 mb-3">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <h3 className="text-base font-bold">Google Gemini AI Engine Specifications</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Active AI Model</span>
            <span className="text-sm font-bold text-white mt-0.5 block">gemini-3.8-flash</span>
            <span className="text-[10px] text-cyan-400">High-speed multimodal inference</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Integration Architecture</span>
            <span className="text-sm font-bold text-white mt-0.5 block">Secure Server-Side Proxy</span>
            <span className="text-[10px] text-emerald-400">Zero client-side API key exposure</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Verification Standard</span>
            <span className="text-sm font-bold text-white mt-0.5 block">Zero Fabricated Telemetry</span>
            <span className="text-[10px] text-purple-300">Hypotheses clearly distinguished</span>
          </div>
        </div>
      </div>

      {/* Brand & About */}
      <div className="p-4 text-center text-xs text-slate-500 space-y-1">
        <p className="font-bold text-slate-400">JourneyX – Customer Journey Mapper</p>
        <p className="italic">“Every Customer Has a Story. Map Every Moment.”</p>
        <p className="text-[11px]">Built with Google AI Studio & Gemini API</p>
      </div>
    </div>
  );
};
