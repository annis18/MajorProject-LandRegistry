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

import { connectWeb3 } from './ethereum';

const MainAppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('explorer');
  const [showResetModal, setShowResetModal] = useState<boolean>(false);
  const [showSampleGuide, setShowSampleGuide] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isLive, setIsLive] = useState<boolean>(false);
  const { resetDemoState, contractAddress, liveContract, setLiveContract } = useBlockchain();
  

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

  const handleConnectWallet = async () => {
    try {
      const { contract, address } = await connectWeb3();
      setWalletAddress(address);
      setIsLive(true);
      setLiveContract(contract);
      addNotification('success', 'Wallet Connected', `Live MetaMask link established: ${shortenAddress(address)}`);
    } catch (error: any) {
      addNotification('error', 'Connection Failed', error.message);
    }
  };

  const runLiveTest = async () => {
    if (!liveContract) return;
    try {
      addNotification('info', 'Initiating Transaction...', 'Please confirm the gas fee in MetaMask.');
      const tx = await liveContract.registerProperty(
        "AXIS-001", 
        "Axis Colleges Campus, Kanpur", 
        1500, 
        walletAddress, 
        "QmHash12345" 
      );
      addNotification('info', 'Mining Block...', 'Waiting for Hardhat to validate the transaction.');
      await tx.wait(); 
      addNotification('success', 'Property Registered!', `AXIS-001 successfully secured on-chain!`);
    } catch (error: any) {
      addNotification('error', 'Transaction Failed', error.message);
    }
  };

  // THIS IS THE NEW READ FUNCTION
  const runLiveReadTest = async () => {
    if (!liveContract) return;
    try {
      addNotification('info', 'Querying Blockchain...', 'Fetching AXIS-001 data from the distributed ledger.');
      const propertyData = await liveContract.getProperty("AXIS-001");
      
      const location = propertyData[0];
      const area = propertyData[1].toString();
      const currentOwner = propertyData[2];
      const docHash = propertyData[3];
      
      addNotification(
        'success', 
        'Data Retrieved!', 
        `Loc: ${location} | Area: ${area} | Hash: ${docHash.substring(0, 10)}...`
      );
      console.log("Full On-Chain Data:", propertyData);
    } catch (error: any) {
      addNotification('error', 'Search Failed', error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#1a1a1a] flex flex-col justify-between selection:bg-[#1a1a1a] selection:text-white">
      <div>
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onShowResetConfirm={() => setShowResetModal(true)}
          onOpenSampleGuide={() => setShowSampleGuide(true)}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className={`p-4 rounded-xl flex items-center justify-between border shadow-sm transition-colors duration-300 ${isLive ? 'bg-[#d3f9d8] border-[#b2f2bb]' : 'bg-[#fff3cd] border-[#ffe066]'}`}>
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-[#2b8a3e] animate-pulse' : 'bg-[#f59f00]'}`} />
              <span className="text-sm font-semibold text-[#1a1a1a]">
                {isLive ? 'Live Network Active (Hardhat Localhost)' : 'Demo Mode Active (Simulated Blockchain)'}
              </span>
            </div>
            {!isLive ? (
              <button 
                onClick={handleConnectWallet} 
                className="px-4 py-2 bg-[#1a1a1a] text-white text-xs font-bold rounded-lg hover:bg-[#343a40] transition-colors shadow-sm"
              >
                Connect MetaMask
              </button>
            ) : (
              <div className="flex gap-2">
                <button 
                  onClick={runLiveTest}
                  className="px-3 py-1 bg-[#2b8a3e] text-white text-xs font-bold rounded-md hover:bg-[#237032] shadow-sm transition-colors"
                >
                  Test Registration
                </button>
                {/* THIS IS THE NEW BUTTON */}
                <button 
                  onClick={runLiveReadTest}
                  className="px-3 py-1 bg-[#1a1a1a] text-white text-xs font-bold rounded-md hover:bg-[#343a40] shadow-sm transition-colors"
                >
                  Fetch Property
                </button>
                <span className="text-xs flex items-center font-mono font-bold text-[#2b8a3e] bg-white px-3 py-1 rounded-md shadow-sm border border-[#b2f2bb]">
                  {walletAddress}
                </span>
              </div>
            )}
          </div>
        </div>

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

      <NotificationToast toasts={toasts} onDismiss={handleDismissToast} />

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