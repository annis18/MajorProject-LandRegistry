import React from 'react';
import { useBlockchain } from '../context/BlockchainContext';
import { shortenAddress } from '../utils/crypto';
import {
  ShieldCheck,
  Wallet,
  RotateCcw,
  Layers,
  FileCheck2,
  Building2,
  Compass,
  Cpu,
  Code2,
  GraduationCap,
  ChevronDown,
  ExternalLink,
  TestTube2,
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onShowResetConfirm: () => void;
  onOpenSampleGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onShowResetConfirm,
  onOpenSampleGuide,
}) => {
  const {
    accounts,
    currentAccount,
    setCurrentAccount,
    blocks,
    isMetaMaskConnected,
    connectMetaMask,
  } = useBlockchain();

  const latestBlockNumber = blocks.length > 0 ? blocks[blocks.length - 1].blockNumber : 101;

  const navTabs = [
    { id: 'explorer', label: 'Public Explorer', icon: Compass, badge: null },
    { id: 'authority', label: 'Authority Portal', icon: ShieldCheck, badge: 'Registrar/Notary' },
    { id: 'owner', label: 'Owner Dashboard', icon: Building2, badge: null },
    { id: 'hasher', label: 'Document Hasher', icon: FileCheck2, badge: 'SHA-256' },
    { id: 'simulator', label: 'EVM & Test Suite', icon: Cpu, badge: 'Hardhat' },
    { id: 'contract', label: 'Solidity & GitHub', icon: Code2, badge: null },
    { id: 'report', label: 'Report & Interview Q&A', icon: GraduationCap, badge: 'Placement' },
  ];

  return (
    <header className="bg-white border-b border-[#e9ecef] sticky top-0 z-40 shadow-xs">
      {/* Top Banner: Network & Active Simulation Wallet Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-3 text-xs border-b border-[#f1f3f5] bg-[#fafbfc]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#e6fcf5] border border-[#b2f2bb] text-[#0ca678] font-semibold text-[11px]">
            <span className="w-2 h-2 rounded-full bg-[#0ca678] animate-pulse" />
            <span>Hardhat Local EVM (ChainID: 31337)</span>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-[#6c757d] font-mono text-[11px]">
            <Layers className="w-3.5 h-3.5 text-[#adb5bd]" />
            <span>Block #{latestBlockNumber}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSampleGuide}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#e6fcf5] hover:bg-[#b2f2bb] text-[#0ca678] border border-[#b2f2bb] transition-colors text-xs font-bold shadow-xs"
            title="View ready-to-test sample inputs for all sections"
          >
            <TestTube2 className="w-3.5 h-3.5" />
            <span>Sample Test Inputs</span>
          </button>

          <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-[#e9ecef] text-[#495057] shadow-xs">
            <span className="text-[#6c757d]">Active Role:</span>
            <span className="font-bold text-[#1a1a1a]">{currentAccount.roleLabel}</span>
          </div>

          <button
            onClick={onShowResetConfirm}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-[#f8f9fa] text-[#495057] hover:text-[#1a1a1a] border border-[#ced4da] transition-colors text-xs font-medium shadow-xs"
            title="Reset to pure default initial state"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#f59f00]" />
            <span className="hidden md:inline">Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Main Header Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1a1a1a] flex items-center justify-center text-white font-bold text-lg shadow-sm">
            LC
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-[#1a1a1a] tracking-tight">LandChain</h1>
              <span className="text-[10px] font-bold bg-[#f1f3f5] text-[#495057] border border-[#e9ecef] px-2 py-0.5 rounded-md uppercase tracking-wider">
                Blockchain Land Registry
              </span>
            </div>
            <p className="text-xs text-[#6c757d] mt-0.5">
              Tamper-evident property titles, role-based verifications & immutable deed history
            </p>
          </div>
        </div>

        {/* Account / Wallet Switcher */}
        <div className="flex items-center gap-3 self-end md:self-auto">
          {/* Account Dropdown */}
          <div className="relative group">
            <label className="block text-[10px] uppercase font-bold text-[#6c757d] mb-0.5 tracking-wider">
              Simulate Account
            </label>
            <div className="flex items-center gap-2 bg-white border border-[#ced4da] hover:border-[#1a1a1a] rounded-lg px-3 py-1.5 cursor-pointer transition-colors shadow-xs">
              <div className="w-2.5 h-2.5 rounded-full bg-[#1a1a1a] ring-2 ring-[#ced4da]" />
              <select
                value={currentAccount.address}
                onChange={e => {
                  const acc = accounts.find(a => a.address === e.target.value);
                  if (acc) setCurrentAccount(acc);
                }}
                className="bg-transparent text-xs text-[#1a1a1a] font-semibold focus:outline-none cursor-pointer pr-4"
              >
                {accounts.map(acc => (
                  <option key={acc.address} value={acc.address} className="bg-white text-[#1a1a1a]">
                    {acc.name} ({shortenAddress(acc.address)})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Connect MetaMask Button */}
          <button
            onClick={connectMetaMask}
            className={`flex items-center gap-2 px-3.5 py-2 mt-3.5 rounded-lg text-xs font-bold transition-all shadow-xs ${
              isMetaMaskConnected
                ? 'bg-[#e6fcf5] border border-[#b2f2bb] text-[#0ca678]'
                : 'bg-[#1a1a1a] hover:bg-[#2d3436] text-white'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>{isMetaMaskConnected ? 'Wallet Connected' : 'Connect Web3'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar border-t border-[#e9ecef] pt-1 pb-0">
          {navTabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold rounded-t-lg transition-all border-b-2 whitespace-nowrap ${
                  isActive
                    ? 'border-[#1a1a1a] text-[#1a1a1a] bg-[#f8f9fa]'
                    : 'border-transparent text-[#6c757d] hover:text-[#1a1a1a] hover:bg-[#f8f9fa]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#1a1a1a]' : 'text-[#6c757d]'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white text-[#495057] border border-[#ced4da] font-mono">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
