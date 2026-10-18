import React, { useState } from 'react';
import { INTERVIEW_QUESTIONS } from '../../data/mockData';
import {
  GraduationCap,
  BookOpen,
  HelpCircle,
  Calendar,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Sparkles,
  Users,
} from 'lucide-react';

export const AcademicReportTab: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'interview' | 'report' | 'timeline'>('interview');
  const [expandedQA, setExpandedQA] = useState<number | null>(1);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleCopy = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const dayWiseTimeline = [
    { day: 'DAY 1', title: 'Project Setup & Planning', desc: 'Installed Node.js, Hardhat, and planned the system workflow.', commit: 'Initialize blockchain land registry project' },
    { day: 'DAY 2', title: 'Smart Contract Data Structures', desc: 'Created Property, Title, and Loan structs in Solidity.', commit: 'Add property data model and structs' },
    { day: 'DAY 3', title: 'Property Registration Function', desc: 'Wrote registerProperty() with Registrar role check and duplicate ID check.', commit: 'Implement authority-based property registration' },
    { day: 'DAY 4', title: 'Surveyor Verification Step', desc: 'Added verifyProperty() so a surveyor must approve a plot before sale.', commit: 'Add property verification workflow' },
    { day: 'DAY 5', title: 'Ownership Transfer Logic', desc: 'Built transferOwnership() with owner checks and active loan blocks.', commit: 'Implement secure ownership transfer' },
    { day: 'DAY 6', title: 'SHA-256 Document Hashing', desc: 'Added document fingerprint hashing to detect altered property papers.', commit: 'Add property document hash verification' },
    { day: 'DAY 7', title: 'Blockchain Events & History', desc: 'Added Solidity Events to keep a permanent log of all past owners.', commit: 'Add ownership history events' },
    { day: 'DAY 8', title: 'Security & Access Control', desc: 'Added require() checks to block unauthorized wallets and invalid inputs.', commit: 'Add security validation modifiers' },
    { day: 'DAY 9', title: 'Automated Testing', desc: 'Tested positive and negative scenarios on the local Hardhat node.', commit: 'Add Hardhat tests' },
    { day: 'DAY 10', title: 'Multi-Account Role Testing', desc: 'Tested Registrar, Surveyor, Notary, and Citizen workflows.', commit: 'Add multi-role simulation proof' },
    { day: 'DAY 11', title: 'React Frontend & Web3 Bridge', desc: 'Built the React dashboard and connected MetaMask using Ethers.js.', commit: 'Add React frontend DApp' },
    { day: 'DAY 12', title: 'Final Documentation & Deployment', desc: 'Prepared project report, viva questions, and deployed UI to Vercel.', commit: 'Complete README and documentation' },
  ];

  return (
    <div className="space-y-6">
      {/* Sub Navigation Bar */}
      <div className="flex items-center gap-2 border-b border-[#e9ecef] pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('interview')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeSubTab === 'interview'
              ? 'bg-[#1a1a1a] text-white shadow-xs'
              : 'bg-white text-[#495057] hover:text-[#1a1a1a] hover:bg-[#f8f9fa] border border-[#ced4da]'
          }`}
        >
          <HelpCircle className="w-4 h-4 text-[#0ca678]" />
          <span>10 Viva & Interview Q&A</span>
        </button>

        <button
          onClick={() => setActiveSubTab('report')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeSubTab === 'report'
              ? 'bg-[#1a1a1a] text-white shadow-xs'
              : 'bg-white text-[#495057] hover:text-[#1a1a1a] hover:bg-[#f8f9fa] border border-[#ced4da]'
          }`}
        >
          <BookOpen className="w-4 h-4 text-[#0ca678]" />
          <span>Major Project Synopsis & Report</span>
        </button>

        <button
          onClick={() => setActiveSubTab('timeline')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeSubTab === 'timeline'
              ? 'bg-[#1a1a1a] text-white shadow-xs'
              : 'bg-white text-[#495057] hover:text-[#1a1a1a] hover:bg-[#f8f9fa] border border-[#ced4da]'
          }`}
        >
          <Calendar className="w-4 h-4 text-[#0ca678]" />
          <span>Development Phases (Day 1–12)</span>
        </button>
      </div>

      {/* SUB-TAB 1: 10 VIVA & INTERVIEW QUESTIONS */}
      {activeSubTab === 'interview' && (
        <div className="space-y-4">
          <div className="bg-white border border-[#e9ecef] rounded-xl p-6 shadow-xs">
            <div className="flex items-start gap-3">
              <GraduationCap className="w-5 h-5 text-[#0ca678] shrink-0 mt-0.5" />
              <div>
                <h2 className="text-base font-bold text-[#1a1a1a] tracking-tight">
                  Major Project Viva & Placement Q&A (10 Core Questions)
                </h2>
                <p className="text-xs text-[#6c757d] mt-1 font-medium">
                  Simple, clear answers for external examiners and technical interviews covering smart contracts, role checks, SHA-256 hashing, and blockchain workflow.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {INTERVIEW_QUESTIONS.map(qa => {
              const isExpanded = expandedQA === qa.id;
              return (
                <div
                  key={qa.id}
                  className="bg-white border border-[#e9ecef] hover:border-[#ced4da] rounded-xl overflow-hidden shadow-xs transition-all"
                >
                  <button
                    onClick={() => setExpandedQA(isExpanded ? null : qa.id)}
                    className="w-full p-4 text-left flex items-start justify-between gap-4 hover:bg-[#f8f9fa] transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-xs font-mono font-bold text-[#0ca678] bg-[#e6fcf5] px-2 py-0.5 rounded border border-[#b2f2bb] shrink-0">
                        Q{qa.id}
                      </span>
                      <div>
                        <h3 className="text-sm font-bold text-[#1a1a1a] leading-snug">{qa.question}</h3>
                        <span className="text-[10px] text-[#6c757d] font-mono mt-1 block">
                          Topic: {qa.category}
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0 text-[#adb5bd]">
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-[#1a1a1a]" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 pt-2 border-t border-[#f1f3f5] space-y-3 text-xs">
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {qa.keyConcepts.map((concept, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#f1f3f5] text-[#495057] border border-[#e9ecef] font-semibold"
                          >
                            {concept}
                          </span>
                        ))}
                      </div>

                      <div className="p-4 bg-[#f8f9fa] rounded-xl border border-[#e9ecef] text-[#343a40] leading-relaxed">
                        <div className="flex items-center justify-between text-[#6c757d] mb-2 font-bold uppercase text-[10px] tracking-wider">
                          <span>Simple Viva Answer:</span>
                          <button
                            onClick={() => handleCopy(qa.answer, qa.id)}
                            className="text-[#6c757d] hover:text-[#0ca678] flex items-center gap-1 normal-case font-medium"
                          >
                            {copiedId === qa.id ? <Check className="w-3.5 h-3.5 text-[#0ca678]" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedId === qa.id ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                        <p className="whitespace-pre-line">{qa.answer}</p>
                      </div>

                      <div className="p-3 bg-[#e6fcf5] rounded-xl border border-[#b2f2bb] text-[#0ca678] text-[11px] flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-[#0ca678] shrink-0 mt-0.5" />
                        <div>
                          <strong className="font-bold text-[#0ca678]">Presentation Tip: </strong>
                          <span className="text-[#2b8a3e]">{qa.studentTip}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: PROJECT SYNOPSIS & REPORT */}
      {activeSubTab === 'report' && (
        <div className="bg-white border border-[#e9ecef] rounded-xl p-6 shadow-xs space-y-6 text-xs text-[#495057] leading-relaxed">
          <div className="border-b border-[#e9ecef] pb-4">
            <span className="text-xs font-mono font-bold text-[#0ca678] uppercase">B.TECH MAJOR PROJECT REPORT</span>
            <h2 className="text-lg font-bold text-[#1a1a1a] mt-1">
              Blockchain-Based Land Registry & Property Ownership System
            </h2>
            <p className="text-xs text-[#6c757d] mt-0.5 font-medium">
              Built with React, TypeScript, Ethers.js, Hardhat, and Solidity Smart Contracts.
            </p>
          </div>

          {/* Team Role Simulation Overview */}
          <div className="p-4 bg-[#f8f9fa] rounded-xl border border-[#e9ecef]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1a1a1a] mb-2 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#0ca678]" />
              <span>Project Team & Role Simulation</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-[11px]">
              <div className="p-2.5 bg-white rounded-lg border border-[#e9ecef]">
                <strong className="text-[#1a1a1a] block">Animesh Singh Chauhan</strong>
                <span className="text-[#0ca678] font-semibold">Role: District Land Registrar (Admin)</span>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-[#e9ecef]">
                <strong className="text-[#1a1a1a] block">Harsh</strong>
                <span className="text-[#1971c2] font-semibold">Role: Government Land Surveyor</span>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-[#e9ecef]">
                <strong className="text-[#1a1a1a] block">Divyanshh</strong>
                <span className="text-[#ae3ec9] font-semibold">Role: Bank & Legal Officer (Notary)</span>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-[#e9ecef]">
                <strong className="text-[#1a1a1a] block">Ayushhh</strong>
                <span className="text-[#f59f00] font-semibold">Role: Verified Property Owner (Seller)</span>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-[#e9ecef]">
                <strong className="text-[#1a1a1a] block">Kartikey</strong>
                <span className="text-[#0ca678] font-semibold">Role: Citizen / Property Buyer</span>
              </div>
            </div>
          </div>

          {/* Section 1: Abstract */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1a1a1a] mb-2">1. Abstract</h3>
            <p>
              Traditional paper-based land registries often face problems like lost files, fake property documents, slow verification, and selling the same plot to multiple people. This project solves these issues by creating a decentralized Land Registry web application using Solidity smart contracts on Ethereum. By combining role-based access (Registrar, Surveyor, Bank Officer, and Citizen), SHA-256 document hashing, and a permanent blockchain history, buyers can check the real owner of any property in seconds while keeping heavy PDF files off the blockchain to save cost.
            </p>
          </div>

          {/* Section 2: Problem Statement */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1a1a1a] mb-2">2. What Problems Does This Solve?</h3>
            <ul className="list-disc pl-5 space-y-1.5 text-[#6c757d]">
              <li><strong className="text-[#1a1a1a]">Tampering with Records:</strong> Paper registers and normal databases can be edited or deleted by someone with admin access. Blockchain records cannot be secretly edited once saved.</li>
              <li><strong className="text-[#1a1a1a]">Double-Selling Fraud:</strong> Fraudsters sometimes sell the same land plot to two buyers using fake papers. On the blockchain, as soon as the owner transfers the plot to Buyer A, they are automatically blocked from transferring it to Buyer B.</li>
              <li><strong className="text-[#1a1a1a]">Slow History Checks:</strong> Checking old ownership records at government offices takes days or weeks. Here, the full chain of past owners is visible in one click.</li>
              <li><strong className="text-[#1a1a1a]">Hidden Bank Loans:</strong> Buyers often don't know if a property has an unpaid bank loan. Our system lets banks lock a mortgaged property on-chain so it cannot be sold until the loan is cleared.</li>
            </ul>
          </div>

          {/* Section 3: System Workflow */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1a1a1a] mb-2">3. Step-by-Step Working of the Project</h3>
            <p className="mb-2">
              Instead of letting one person do everything, our smart contract divides the work across different officials for safety:
            </p>
            <div className="bg-[#f8f9fa] p-4 rounded-xl border border-[#e9ecef] font-mono text-[11px] text-[#1a1a1a] space-y-1.5 font-semibold">
              <p>Step 1: Registrar (Animesh) registers a new plot → [Status: REGISTERED]</p>
              <p>Step 2: Surveyor (Harsh) checks the boundary and approves it → [Status: VERIFIED]</p>
              <p>Step 3: Bank Officer (Divyanshh) can attach a loan lock if mortgaged → [Status: ENCUMBERED / LOCKED]</p>
              <p>Step 4: Once the loan is paid, the Bank Officer unlocks the plot → [Status: VERIFIED]</p>
              <p>Step 5: Current Owner (Ayushhh) transfers ownership to Buyer (Kartikey) → [Status: TRANSFERRED]</p>
            </div>
          </div>

          {/* Section 4: Practical Limitations */}
          <div className="p-4 bg-[#fff9db] rounded-xl border border-[#ffec99]">
            <h3 className="text-xs font-bold text-[#f59f00] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-[#f59f00]" />
              <span>4. Real-World Limitations (Important for Viva)</span>
            </h3>
            <p className="text-[#495057] mb-2 font-medium">
              While blockchain secures digital records, we also considered practical real-world rules:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-[#6c757d]">
              <li><strong className="text-[#1a1a1a]">Initial Data Accuracy:</strong> Blockchain guarantees that data cannot be changed *after* it is entered, but a government Registrar and Surveyor still need to check the physical land and papers the very first time.</li>
              <li><strong className="text-[#1a1a1a]">Legal Courts & Disputes:</strong> In the real world, family inheritance or court stay orders still require legal authorities, which is why we included a Legal Officer / Notary role to lock disputed properties.</li>
              <li><strong className="text-[#1a1a1a]">User Identity Link:</strong> In a real government rollout, wallet addresses would be linked to official citizen ID portals (such as DigiLocker) so citizens don't lose their property if they forget their wallet password.</li>
            </ul>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: 12-DAY DEVELOPMENT TIMELINE */}
      {activeSubTab === 'timeline' && (
        <div className="bg-white border border-[#e9ecef] rounded-xl p-6 shadow-xs space-y-6">
          <div>
            <h2 className="text-base font-bold text-[#1a1a1a] tracking-tight">
              Step-by-Step Development Log (12 Milestones)
            </h2>
            <p className="text-xs text-[#6c757d] mt-1 font-medium">
              How the project was built from smart contract design to React frontend integration.
            </p>
          </div>

          <div className="space-y-3 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#e9ecef]">
            {dayWiseTimeline.map((item, idx) => (
              <div key={idx} className="flex items-start gap-4 relative pl-8">
                <div className="absolute left-2 top-2 w-3.5 h-3.5 rounded-full -translate-x-1/2 bg-[#0ca678] border-2 border-white ring-2 ring-[#b2f2bb]" />

                <div className="flex-1 bg-[#f8f9fa] p-3.5 rounded-xl border border-[#e9ecef] text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-[#1a1a1a]">
                      {item.day}: {item.title}
                    </span>
                    <span className="text-[10px] font-mono text-[#0ca678] bg-[#e6fcf5] px-2 py-0.5 rounded border border-[#b2f2bb] font-bold">
                      DONE
                    </span>
                  </div>

                  <p className="text-[#6c757d] text-[11px] mb-2 font-medium">{item.desc}</p>

                  <div className="p-2 bg-white rounded-lg border border-[#ced4da] font-mono text-[10px] text-[#495057] flex items-center justify-between font-semibold">
                    <span>Git Commit: "{item.commit}"</span>
                    <button
                      onClick={() => handleCopy(`git commit -m "${item.commit}"`, idx + 100)}
                      className="text-[#adb5bd] hover:text-[#0ca678]"
                    >
                      {copiedId === idx + 100 ? <Check className="w-3.5 h-3.5 text-[#0ca678]" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};