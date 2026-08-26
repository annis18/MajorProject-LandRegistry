import React, { useState } from 'react';
import {
  SOLIDITY_CONTRACT_CODE,
  HARDHAT_TEST_CODE,
  HARDHAT_DEPLOY_SCRIPT,
  HARDHAT_CONFIG_JS,
} from '../../contracts/LandRegistryCode';
import { DUMMY_PROPERTY_001_JSON } from '../../data/mockData';
import {
  Code2,
  FileCode,
  Copy,
  Check,
  FolderTree,
  Github,
  Terminal,
  Download,
  BookOpen,
} from 'lucide-react';

export const SmartContractCodeTab: React.FC = () => {
  const [activeFile, setActiveFile] = useState<
    'solidity' | 'test' | 'deploy' | 'config' | 'json' | 'git'
  >('solidity');
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFile(label);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  const getActiveContent = () => {
    switch (activeFile) {
      case 'solidity':
        return SOLIDITY_CONTRACT_CODE;
      case 'test':
        return HARDHAT_TEST_CODE;
      case 'deploy':
        return HARDHAT_DEPLOY_SCRIPT;
      case 'config':
        return HARDHAT_CONFIG_JS;
      case 'json':
        return JSON.stringify(DUMMY_PROPERTY_001_JSON, null, 2);
      case 'git':
        return `# ================================================================
# GITHUB REPOSITORY SETUP COMMANDS (PDF Section 21)
# ================================================================

# 1. Initialize local git repository
git init
git add .
git commit -m "Initialize blockchain land registry project"

# 2. Add property data model & contracts
git add contracts/LandRegistry.sol
git commit -m "Add property data model and structs"

# 3. Implement registration & verification
git commit -m "Implement authority-based property registration and verification"

# 4. Add secure ownership transfer & encumbrance logic
git commit -m "Implement secure ownership transfer and mortgage encumbrance logic"

# 5. Add Hardhat test suite
git add test/LandRegistry.test.js scripts/deploy.js hardhat.config.js
git commit -m "Add Hardhat automated unit test suite and deploy script"

# 6. Add Document Hash Verification
git add sample_documents/property_001.json
git commit -m "Add property document hash verification and tamper detection"

# 7. Push to GitHub
git remote add origin https://github.com/your-username/Blockchain-Land-Registry-Property-Ownership.git
git branch -M main
git push -u origin main
`;
      default:
        return '';
    }
  };

  const getFileName = () => {
    switch (activeFile) {
      case 'solidity':
        return 'contracts/LandRegistry.sol';
      case 'test':
        return 'test/LandRegistry.test.js';
      case 'deploy':
        return 'scripts/deploy.js';
      case 'config':
        return 'hardhat.config.js';
      case 'json':
        return 'sample_documents/property_001.json';
      case 'git':
        return 'git_setup_commands.sh';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Overview */}
      <div className="bg-white border border-[#e9ecef] rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Github className="w-5 h-5 text-[#1a1a1a]" />
            <h2 className="text-base font-bold text-[#1a1a1a] tracking-tight">
              Blockchain-Land-Registry-Property-Ownership
            </h2>
          </div>
          <p className="text-xs text-[#6c757d] mt-1 font-medium">
            Production-grade Solidity (^0.8.20) smart contracts, Hardhat deploy scripts, Chai unit test suites, and sample document assets.
          </p>
        </div>

        <button
          onClick={() => handleCopy(getActiveContent(), activeFile)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#f8f9fa] hover:bg-[#e9ecef] text-[#1a1a1a] border border-[#ced4da] text-xs font-bold transition-colors self-start md:self-auto shrink-0 shadow-xs"
        >
          {copiedFile === activeFile ? (
            <>
              <Check className="w-4 h-4 text-[#0ca678]" />
              <span className="text-[#0ca678]">COPIED TO CLIPBOARD!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-[#6c757d]" />
              <span>COPY CURRENT FILE</span>
            </>
          )}
        </button>
      </div>

      {/* Code Viewer with File Tabs */}
      <div className="bg-white border border-[#e9ecef] rounded-xl overflow-hidden shadow-xs">
        {/* File Tabs */}
        <div className="flex items-center gap-1 bg-[#f8f9fa] px-4 pt-3 border-b border-[#e9ecef] overflow-x-auto">
          {[
            { id: 'solidity', label: 'LandRegistry.sol', icon: FileCode, badge: 'Solidity ^0.8.20' },
            { id: 'test', label: 'LandRegistry.test.js', icon: FileCode, badge: 'Chai / Ethers' },
            { id: 'deploy', label: 'deploy.js', icon: Terminal, badge: 'Hardhat' },
            { id: 'config', label: 'hardhat.config.js', icon: FileCode, badge: 'Config' },
            { id: 'json', label: 'property_001.json', icon: FileCode, badge: 'Sample Deed' },
            { id: 'git', label: 'Git Setup Commands', icon: Github, badge: 'CLI' },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeFile === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFile(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-t-lg transition-all border-b-2 whitespace-nowrap ${
                  isActive
                    ? 'border-[#1a1a1a] text-[#1a1a1a] bg-white'
                    : 'border-transparent text-[#6c757d] hover:text-[#1a1a1a] hover:bg-[#e9ecef]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#0ca678]' : 'text-[#adb5bd]'}`} />
                <span>{tab.label}</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#e9ecef] text-[#495057] font-mono font-medium">
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* File Info Bar */}
        <div className="px-5 py-2 bg-[#f8f9fa] border-b border-[#e9ecef] flex items-center justify-between text-xs text-[#6c757d] font-mono font-medium">
          <span>Path: <strong className="text-[#1a1a1a]">{getFileName()}</strong></span>
          <span>Lines: {getActiveContent().split('\n').length}</span>
        </div>

        {/* Code Content Container */}
        <div className="p-5 bg-[#ffffff] overflow-x-auto max-h-[600px] overflow-y-auto">
          <pre className="font-mono text-xs text-[#1a1a1a] leading-relaxed selection:bg-[#b2f2bb]">
            <code>{getActiveContent()}</code>
          </pre>
        </div>
      </div>

      {/* Recommended Folder Structure Breakdown (PDF Section 13) */}
      <div className="bg-white border border-[#e9ecef] rounded-xl p-6 shadow-xs">
        <h3 className="text-xs font-bold text-[#6c757d] uppercase tracking-wider mb-4 flex items-center gap-2">
          <FolderTree className="w-4 h-4 text-[#0ca678]" />
          <span>Recommended Project Directory Architecture (PDF Section 13)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="bg-[#f8f9fa] p-4 rounded-xl border border-[#e9ecef] space-y-1 text-[#495057]">
            <p className="text-[#0ca678] font-bold">Blockchain-Land-Registry-Property-Ownership/</p>
            <p className="pl-4">├── contracts/</p>
            <p className="pl-8 text-[#1a1a1a] font-bold">└── LandRegistry.sol <span className="text-[#6c757d] font-sans text-[11px] font-normal">(Core smart contract)</span></p>
            <p className="pl-4">├── scripts/</p>
            <p className="pl-8 text-[#1a1a1a] font-bold">└── deploy.js <span className="text-[#6c757d] font-sans text-[11px] font-normal">(Automated deployer)</span></p>
            <p className="pl-4">├── test/</p>
            <p className="pl-8 text-[#1a1a1a] font-bold">└── LandRegistry.test.js <span className="text-[#6c757d] font-sans text-[11px] font-normal">(20+ Hardhat tests)</span></p>
            <p className="pl-4">├── frontend/</p>
            <p className="pl-8">├── src/</p>
            <p className="pl-12">└── components/</p>
            <p className="pl-4">├── sample_documents/</p>
            <p className="pl-8 text-[#0ca678] font-semibold">└── property_001.json</p>
            <p className="pl-4">├── README.md</p>
            <p className="pl-4">├── hardhat.config.js</p>
            <p className="pl-4">└── package.json</p>
          </div>

          <div className="space-y-2.5 font-sans text-xs text-[#495057]">
            <div className="p-3 bg-[#f8f9fa] rounded-xl border border-[#e9ecef]">
              <strong className="text-[#1a1a1a] block mb-0.5 font-bold">contracts/LandRegistry.sol</strong>
              <p className="text-[#6c757d] text-[11px] leading-relaxed">
                Contains state mappings, modifiers (`onlyRegistrar`, `onlyNotary`, `onlyPropertyOwner`), structs (`Parcel`, `Title`, `Encumbrance`), and audit events.
              </p>
            </div>

            <div className="p-3 bg-[#f8f9fa] rounded-xl border border-[#e9ecef]">
              <strong className="text-[#1a1a1a] block mb-0.5 font-bold">test/LandRegistry.test.js</strong>
              <p className="text-[#6c757d] text-[11px] leading-relaxed">
                Validates edge-cases: duplicate parcel rejection, unauthorized transfer prevention, encumbered title blocks, and zero address protection.
              </p>
            </div>

            <div className="p-3 bg-[#f8f9fa] rounded-xl border border-[#e9ecef]">
              <strong className="text-[#1a1a1a] block mb-0.5 font-bold">sample_documents/property_001.json</strong>
              <p className="text-[#6c757d] text-[11px] leading-relaxed">
                Off-chain JSON containing deed details, survey boundaries, and tax clearance references whose SHA-256 digest is anchored on-chain.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
