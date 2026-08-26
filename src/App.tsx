import React, { useState } from 'react';
import { BlockchainProvider, useBlockchain } from './context/BlockchainContext';
import { Header } from './components/Header';
import { PublicExplorerTab } from './components/tabs/PublicExplorerTab';
import { AuthorityDashboardTab } from './components/tabs/AuthorityDashboardTab';
import { OwnerDashboardTab } from './components/tabs/OwnerDashboardTab';
import { DocumentHasherTab } from './components/tabs/DocumentHasherTab';
import { HardhatSimulatorTab } from './components/tabs/HardhatSimulatorTab';
import { SmartContractCodeTab } from './components/tabs/SmartContractCodeTab';
import { AcademicReportTab } from './components/tabs/AcademicReportTab';
import { NotificationToast, ToastMessage } from './components/common/NotificationToast';
import { SampleInputsGuideModal } from './components/common/SampleInputsGuideModal';
import { shortenAddress } from './utils/crypto';
import { ShieldCheck, RotateCcw, Github, BookOpen } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('explorer');
  const [showResetModal, setShowResetModal] = useState<boolean>(false);
  const [showSampleGuide, setShowSampleGuide] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const { resetDemoState, contractAddress } = useBlockchain();

  const addNotification = (
    type: 'success' | 'error' | 'info',
    title: string,
    message: string,
    txHash?: string
  ) => {
    const newToast: ToastMessage = {
      id: 'toast-' + Date.now(),
      type,
      title,
      message,
      txHash,
    };
    setToasts(prev => [...prev, newToast]);

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== newToast.id));
    }, 5000);
  };

  const handleDismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleConfirmReset = () => {
    resetDemoState();
    setShowResetModal(false);
    addNotification('info', 'Demo State Reset', 'Blockchain state successfully restored to genesis demo values.');
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#1a1a1a] flex flex-col justify-between selection:bg-[#1a1a1a] selection:text-white">
      <div>
        {/* Navigation & Header */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onShowResetConfirm={() => setShowResetModal(true)}
          onOpenSampleGuide={() => setShowSampleGuide(true)}
        />

        {/* Main Content Body */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'explorer' && <PublicExplorerTab />}
          {activeTab === 'authority' && <AuthorityDashboardTab onNotify={addNotification} />}
          {activeTab === 'owner' && <OwnerDashboardTab onNotify={addNotification} />}
          {activeTab === 'hasher' && <DocumentHasherTab />}
          {activeTab === 'simulator' && <HardhatSimulatorTab />}
          {activeTab === 'contract' && <SmartContractCodeTab />}
          {activeTab === 'report' && <AcademicReportTab />}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#e9ecef] bg-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#6c757d]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#0ca678]" />
            <span className="font-semibold text-[#1a1a1a]">LandChain Registry Protocol</span>
            <span className="text-[#ced4da]">|</span>
            <span className="font-mono text-[#495057]">Contract: {shortenAddress(contractAddress)}</span>
          </div>

          <div className="flex items-center gap-4 text-[#6c757d] text-center md:text-right">
            <span>Educational Blockchain Prototype (Solidity ^0.8.20)</span>
            <span className="text-[#ced4da]">|</span>
            <span>MIT License</span>
          </div>
        </div>
      </footer>

      {/* Global Notification Toast Container */}
      <NotificationToast toasts={toasts} onDismiss={handleDismissToast} />

      {/* Reset State Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-[#1a1a1a]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#e9ecef] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-[#f59f00]">
              <RotateCcw className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-bold text-[#1a1a1a]">Reset Demo State?</h3>
            </div>

            <p className="text-xs text-[#495057] leading-relaxed">
              This will restore all property parcels, block heights, encumbrance states, and title histories back to their initial default demonstration dataset. Any newly registered parcels in your current browser session will be reset.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 rounded-lg bg-white hover:bg-[#f1f3f5] text-[#495057] hover:text-[#1a1a1a] border border-[#ced4da] text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReset}
                className="px-4 py-2 rounded-lg bg-[#1a1a1a] hover:bg-[#2d3436] text-white text-xs font-bold transition-colors shadow-sm"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sample Inputs & Testing Guide Modal */}
      <SampleInputsGuideModal
        isOpen={showSampleGuide}
        onClose={() => setShowSampleGuide(false)}
        onSelectTab={(tabId) => {
          setActiveTab(tabId);
          setShowSampleGuide(false);
        }}
      />
    </div>
  );
};

export default function App() {
  return (
    <BlockchainProvider>
      <MainAppContent />
    </BlockchainProvider>
  );
}
