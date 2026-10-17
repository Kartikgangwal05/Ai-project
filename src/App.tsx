/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Journey, JourneyStage } from './types/journey';
import {
  getStoredJourneys,
  saveJourneysToStorage,
  getActiveJourneyId,
  setActiveJourneyId,
  ALL_SAMPLE_JOURNEYS,
} from './utils/journeyStore';

import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { CreateJourneyView } from './components/CreateJourneyView';
import { CustomerPersonasView } from './components/CustomerPersonasView';
import { TouchpointsView } from './components/TouchpointsView';
import { PainPointsMatrixView } from './components/PainPointsMatrixView';
import { KPIDashboardView } from './components/KPIDashboardView';
import { UploadAndAskView } from './components/UploadAndAskView';
import { CompareJourneysView } from './components/CompareJourneysView';
import { PresentationPrintView } from './components/PresentationPrintView';
import { SettingsView } from './components/SettingsView';
import { StageDetailModal } from './components/StageDetailModal';
import { JourneyCopilotDrawer } from './components/JourneyCopilotDrawer';
import { Check, AlertTriangle, Trash2, X, Sparkles, MessageSquare } from 'lucide-react';

export default function App() {
  const [journeys, setJourneys] = useState<Journey[]>(() => getStoredJourneys());
  const [activeId, setActiveId] = useState<string>(() => getActiveJourneyId());
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isDark, setIsDark] = useState<boolean>(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [deleteConfirmJourney, setDeleteConfirmJourney] = useState<Journey | null>(null);

  // Stage detail modal state
  const [inspectedStage, setInspectedStage] = useState<JourneyStage | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3200);
  };

  // Get current active journey or fallback to first
  const activeJourney =
    journeys.find((j) => j.id === activeId) || journeys[0] || ALL_SAMPLE_JOURNEYS['sample-ecommerce-1'];

  useEffect(() => {
    setActiveJourneyId(activeJourney.id);
  }, [activeJourney.id]);

  const handleSelectJourney = (id: string) => {
    if (journeys.some((j) => j.id === id)) {
      setActiveId(id);
      setActiveJourneyId(id);
      showToast('Switched active journey map.');
    } else if (ALL_SAMPLE_JOURNEYS[id]) {
      const template = ALL_SAMPLE_JOURNEYS[id];
      const updatedList = [template, ...journeys];
      setJourneys(updatedList);
      saveJourneysToStorage(updatedList);
      setActiveId(id);
      setActiveJourneyId(id);
      showToast(`Loaded "${template.title}".`);
    }
  };

  const handleUpdateActiveJourney = (updatedJourney: Journey) => {
    const updatedList = journeys.map((j) => (j.id === updatedJourney.id ? updatedJourney : j));
    setJourneys(updatedList);
    saveJourneysToStorage(updatedList);
  };

  const handleJourneyCreated = (newJourney: Journey) => {
    const updatedList = [newJourney, ...journeys];
    setJourneys(updatedList);
    saveJourneysToStorage(updatedList);
    setActiveId(newJourney.id);
    setActiveTab('dashboard');
    showToast(`Created journey map: "${newJourney.title}".`);
  };

  const handleDeleteJourney = (id: string) => {
    if (journeys.length <= 1) {
      showToast('Cannot delete the only remaining journey map.');
      return;
    }
    const target = journeys.find((j) => j.id === id);
    if (target) {
      setDeleteConfirmJourney(target);
    }
  };

  const confirmDeleteJourney = () => {
    if (!deleteConfirmJourney) return;
    const id = deleteConfirmJourney.id;
    const remaining = journeys.filter((j) => j.id !== id);
    setJourneys(remaining);
    saveJourneysToStorage(remaining);
    if (activeId === id && remaining.length > 0) {
      setActiveId(remaining[0].id);
    }
    setDeleteConfirmJourney(null);
    showToast(`Deleted "${deleteConfirmJourney.title}".`);
  };

  const handleDuplicateJourney = (id: string) => {
    const target = journeys.find((j) => j.id === id);
    if (!target) return;

    const duplicated: Journey = {
      ...target,
      id: `journey-${Date.now()}`,
      title: `${target.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isSample: false,
    };

    const updatedList = [duplicated, ...journeys];
    setJourneys(updatedList);
    saveJourneysToStorage(updatedList);
    setActiveId(duplicated.id);
    showToast(`Duplicated "${target.title}".`);
  };

  // From Upload & Ask AI: merge extracted pain points/touchpoints into active journey
  const handleApplyExtractedInsights = (extractedPains: any[], extractedTouchpoints: any[]) => {
    if (!activeJourney.stages || activeJourney.stages.length === 0) return;

    const targetStage = activeJourney.stages[0]; // Merge into first or relevant stage
    const newPainItems = extractedPains.map((p, idx) => ({
      id: `pp-ext-${Date.now()}-${idx}`,
      title: p.point.slice(0, 45),
      stageId: targetStage.id,
      stageName: targetStage.name,
      description: p.point,
      cause: 'Extracted from uploaded research document',
      impact: p.impact || 'High',
      effort: 'Medium' as const,
      solution: 'Investigate and address friction reported in customer document',
      status: 'Identified' as const,
    }));

    const newTouchpoints = extractedTouchpoints.map((tp, idx) => ({
      id: `tp-ext-${Date.now()}-${idx}`,
      channel: tp.channel,
      customerAction: 'Interacts via document observation',
      expectation: 'Frictionless response',
      friction: 'Medium' as const,
      recommendedKPI: 'Customer Satisfaction Score',
    }));

    const updatedStages = activeJourney.stages.map((stage, idx) => {
      if (idx === 0) {
        return {
          ...stage,
          painPoints: [...(stage.painPoints || []), ...newPainItems],
          touchpoints: [...(stage.touchpoints || []), ...newTouchpoints],
        };
      }
      return stage;
    });

    handleUpdateActiveJourney({
      ...activeJourney,
      stages: updatedStages,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleCreateJourneyFromDoc = (summaryText: string) => {
    setActiveTab('create');
  };

  const handleSaveStageFromModal = (updatedStage: JourneyStage) => {
    const exists = activeJourney.stages.some((s) => s.id === updatedStage.id);
    let updatedStages: JourneyStage[];

    if (exists) {
      updatedStages = activeJourney.stages.map((s) => (s.id === updatedStage.id ? updatedStage : s));
    } else {
      updatedStages = [...activeJourney.stages, updatedStage];
    }

    handleUpdateActiveJourney({
      ...activeJourney,
      stages: updatedStages,
      updatedAt: new Date().toISOString(),
    });

    setInspectedStage(null);
  };

  return (
    <div className={`min-h-screen flex app-grid-bg ${isDark ? 'bg-[#060913] text-white' : 'bg-slate-50 text-slate-900'}`}>
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        activeJourney={activeJourney}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          activeTab={activeTab}
          activeJourney={activeJourney}
          allJourneys={journeys}
          onSelectJourney={handleSelectJourney}
          onCreateNew={() => setActiveTab('create')}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onToggleCopilot={() => setIsCopilotOpen(!isCopilotOpen)}
          onNavigateTab={setActiveTab}
          onJourneyLoaded={handleJourneyCreated}
          isDark={isDark}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              activeJourney={activeJourney}
              allJourneys={journeys}
              onSelectJourney={handleSelectJourney}
              onCreateNew={() => setActiveTab('create')}
              onOpenStageModal={(s) => setInspectedStage(s)}
              onDeleteJourney={handleDeleteJourney}
              onDuplicateJourney={handleDuplicateJourney}
              onNavigateTab={setActiveTab}
              onJourneyLoaded={handleJourneyCreated}
              isDark={isDark}
            />
          )}

          {activeTab === 'my-journeys' && (
            <DashboardView
              activeJourney={activeJourney}
              allJourneys={journeys}
              onSelectJourney={handleSelectJourney}
              onCreateNew={() => setActiveTab('create')}
              onOpenStageModal={(s) => setInspectedStage(s)}
              onDeleteJourney={handleDeleteJourney}
              onDuplicateJourney={handleDuplicateJourney}
              onNavigateTab={setActiveTab}
              onJourneyLoaded={handleJourneyCreated}
              isDark={isDark}
            />
          )}

          {activeTab === 'create' && (
            <CreateJourneyView
              onJourneyCreated={handleJourneyCreated}
              isDark={isDark}
            />
          )}

          {activeTab === 'personas' && (
            <CustomerPersonasView
              journey={activeJourney}
              onUpdateJourney={handleUpdateActiveJourney}
              isDark={isDark}
            />
          )}

          {activeTab === 'touchpoints' && (
            <TouchpointsView
              journey={activeJourney}
              onUpdateJourney={handleUpdateActiveJourney}
              isDark={isDark}
            />
          )}

          {activeTab === 'matrix' && (
            <PainPointsMatrixView
              journey={activeJourney}
              onUpdateJourney={handleUpdateActiveJourney}
              isDark={isDark}
            />
          )}

          {activeTab === 'kpis' && (
            <KPIDashboardView
              journey={activeJourney}
              onUpdateJourney={handleUpdateActiveJourney}
              isDark={isDark}
            />
          )}

          {activeTab === 'upload' && (
            <UploadAndAskView
              activeJourney={activeJourney}
              onApplyExtractedInsights={handleApplyExtractedInsights}
              onCreateJourneyFromDoc={handleCreateJourneyFromDoc}
              isDark={isDark}
            />
          )}

          {activeTab === 'copilot' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="p-8 sm:p-12 rounded-3xl glass-panel relative overflow-hidden text-center space-y-4 border border-purple-500/40 shadow-2xl">
                <div className="absolute top-0 right-1/2 translate-x-1/2 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>
                
                <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-[2px] shadow-xl shadow-purple-600/40">
                  <div className="w-full h-full rounded-[22px] bg-[#050816] flex items-center justify-center text-cyan-300">
                    <Sparkles className="w-8 h-8 animate-pulse text-cyan-400" />
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-2xl font-black text-white tracking-tight">
                    Journey Copilot AI Strategy Room
                  </h3>
                  <p className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed">
                    Real-time AI advisory assistant grounded on <strong className="text-cyan-300 font-semibold">{activeJourney.title}</strong>. Ask for drop-off diagnostics, friction remedies, ROI-prioritized experiments, or custom personas.
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsCopilotOpen(true)}
                    className="px-6 py-3 rounded-2xl animated-gradient-active hover:scale-[1.02] font-bold text-xs text-white shadow-xl shadow-purple-600/40 flex items-center gap-2 border border-white/20 transition-all"
                  >
                    <MessageSquare className="w-4 h-4 text-cyan-200" />
                    <span>Launch Strategy Copilot Assistant</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'compare' && (
            <CompareJourneysView
              journeys={journeys}
              currentJourneyId={activeJourney.id}
              isDark={isDark}
            />
          )}

          {activeTab === 'presentation' && (
            <PresentationPrintView
              journey={activeJourney}
              onBack={() => setActiveTab('dashboard')}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              journeys={journeys}
              onReloadJourneys={(reloaded) => {
                setJourneys(reloaded);
                if (reloaded[0]) setActiveId(reloaded[0].id);
              }}
              isDark={isDark}
            />
          )}
        </main>
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl glass-panel border border-cyan-400/40 text-white text-xs font-semibold shadow-2xl animate-in fade-in slide-in-from-bottom-3">
          <div className="w-5 h-5 rounded-full bg-cyan-400/20 text-cyan-300 flex items-center justify-center flex-shrink-0">
            <Check className="w-3.5 h-3.5" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Delete Journey Confirmation Modal */}
      {deleteConfirmJourney && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md p-6 sm:p-7 rounded-3xl glass-panel border border-rose-500/40 text-white space-y-4 shadow-2xl">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center flex-shrink-0 border border-rose-500/30">
                <Trash2 className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">
                  Delete "{deleteConfirmJourney.title}"?
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Are you sure you want to delete this customer journey map? This will remove all associated stages, touchpoints, and matrix items from your workspace.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmJourney(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/[0.06] hover:bg-white/[0.1] text-slate-300 border border-white/[0.1]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteJourney}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-900/50"
              >
                Delete Map
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Journey Copilot Drawer */}
      <JourneyCopilotDrawer
        activeJourney={activeJourney}
        isOpen={isCopilotOpen}
        onToggle={() => setIsCopilotOpen(!isCopilotOpen)}
        isDark={isDark}
      />

      {/* Stage Inspection & Editing Modal */}
      {inspectedStage && (
        <StageDetailModal
          stage={inspectedStage}
          journeyContext={{
            productName: activeJourney.productName,
            industry: activeJourney.industry,
            businessModel: activeJourney.businessModel,
          }}
          onClose={() => setInspectedStage(null)}
          onSave={handleSaveStageFromModal}
          isDark={isDark}
        />
      )}
    </div>
  );
}
