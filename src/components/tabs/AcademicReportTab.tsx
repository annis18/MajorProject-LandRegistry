import React, { useState } from 'react';
import { INTERVIEW_QUESTIONS } from '../../data/mockData';
import {
  GraduationCap,
  BookOpen,
  FileText,
  HelpCircle,
  Calendar,
  ShieldCheck,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Download,
  Copy,
  Check,
  CheckCircle2,
  Sparkles,
  ExternalLink,
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
    { day: 'DAY 1', title: 'Architecture & Environment', desc: 'Hardhat setup, node.js environment, and workflow planning.', commit: 'Initialize blockchain land registry project' },
    { day: 'DAY 2', title: 'Property Struct & Data Model', desc: 'Designed Parcel, Title, and Encumbrance structs in Solidity.', commit: 'Add property data model and structs' },
    { day: 'DAY 3', title: 'Property Registration Logic', desc: 'Implemented registerParcel() with role checks and duplicate guards.', commit: 'Implement authority-based property registration' },
    { day: 'DAY 4', title: 'Property Verification Workflow', desc: 'Separated registration from surveyor cadastral verification.', commit: 'Add property verification workflow' },
    { day: 'DAY 5', title: 'Ownership Transfer & Mutations', desc: 'Built transferTitle() with caller ownership and lien checks.', commit: 'Implement secure ownership transfer' },
    { day: 'DAY 6', title: 'Document Hashing (SHA-256)', desc: 'Added cryptographic deed hashing and tamper comparison tool.', commit: 'Add property document hash verification' },
    { day: 'DAY 7', title: 'Ownership History & EVM Events', desc: 'Emitted ParcelRegistered, TitleTransferred, and Encumbrance events.', commit: 'Add ownership history events' },
    { day: 'DAY 8', title: 'Smart Contract Security Testing', desc: 'Verified zero address rejection, access control modifiers, and invariants.', commit: 'Add security validation modifiers' },
    { day: 'DAY 9', title: 'Hardhat Automated Test Suite', desc: 'Authored 16+ unit tests in Chai with positive and negative paths.', commit: 'Add Hardhat tests' },
    { day: 'DAY 10', title: 'Remix Simulation & Proofs', desc: 'Simulated multi-account workflows in Remix VM with test signers.', commit: 'Add Remix simulation proof' },
    { day: 'DAY 11', title: 'React Frontend DApp', desc: 'Integrated UI for search, provenance explorer, and transfer workflows.', commit: 'Add React frontend DApp' },
    { day: 'DAY 12', title: 'README & GitHub Strategy', desc: 'Finalized comprehensive documentation, diagrams, and interview prep.', commit: 'Complete README and documentation' },
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
          <span>10 Predicted Interview Q&A</span>
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
          <span>Academic Project Report</span>
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
          <span>Day-Wise Development History (Day 1-12)</span>
        </button>
      </div>

      {/* SUB-TAB 1: 10 INTERVIEW QUESTIONS & ANSWERS (PDF Section 26) */}
      {activeSubTab === 'interview' && (
        <div className="space-y-4">
          <div className="bg-white border border-[#e9ecef] rounded-xl p-6 shadow-xs">
            <div className="flex items-start gap-3">
              <GraduationCap className="w-5 h-5 text-[#0ca678] shrink-0 mt-0.5" />
              <div>
                <h2 className="text-base font-bold text-[#1a1a1a] tracking-tight">
                  Placement & Blockchain Interview Preparation (10 Q&A)
                </h2>
                <p className="text-xs text-[#6c757d] mt-1 font-medium">
                  Master these 10 core questions covering smart contract architecture, role access control, gas optimization, document hashing, and real-world legal limits.
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
                          Category: {qa.category}
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0 text-[#adb5bd]">
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-[#1a1a1a]" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 pt-2 border-t border-[#f1f3f5] space-y-3 text-xs">
                      {/* Concepts Tag */}
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

                      {/* Main Answer */}
                      <div className="p-4 bg-[#f8f9fa] rounded-xl border border-[#e9ecef] text-[#343a40] leading-relaxed">
                        <div className="flex items-center justify-between text-[#6c757d] mb-2 font-bold uppercase text-[10px] tracking-wider">
                          <span>Recommended Technical Answer:</span>
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

                      {/* Student Tip */}
                      <div className="p-3 bg-[#e6fcf5] rounded-xl border border-[#b2f2bb] text-[#0ca678] text-[11px] flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-[#0ca678] shrink-0 mt-0.5" />
                        <div>
                          <strong className="font-bold text-[#0ca678]">Student Presentation Tip: </strong>
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

      {/* SUB-TAB 2: FULL ACADEMIC PROJECT REPORT (PDF Section 25) */}
      {activeSubTab === 'report' && (
        <div className="bg-white border border-[#e9ecef] rounded-xl p-6 shadow-xs space-y-6 text-xs text-[#495057] leading-relaxed">
          <div className="border-b border-[#e9ecef] pb-4">
            <span className="text-xs font-mono font-bold text-[#0ca678] uppercase">ACADEMIC PROJECT REPORT</span>
            <h2 className="text-lg font-bold text-[#1a1a1a] mt-1">
              Blockchain-Based Land Registry & Property Ownership System
            </h2>
            <p className="text-xs text-[#6c757d] mt-0.5 font-medium">
              Comprehensive technical specification, smart contract design, security audit & real-world limitations.
            </p>
          </div>

          {/* Section 1: Abstract */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1a1a1a] mb-2">1. Abstract</h3>
            <p>
              Traditional paper-based land administration frameworks suffer from record tampering, unauthorized mutations, double-selling disputes, and protracted manual verification delays. This project presents a decentralized, tamper-evident land registry prototype built with Solidity smart contracts and EVM blockchain infrastructure. By combining role-based access control (Registrar, Cadastral Surveyor, Legal Notary), cryptographic SHA-256 document hashing, and immutable event-driven provenance trails, the system provides transparent property title verification while keeping heavy documents off-chain.
            </p>
          </div>

          {/* Section 2: Problem Statement */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1a1a1a] mb-2">2. Problem Statement & Challenges</h3>
            <ul className="list-disc pl-5 space-y-1.5 text-[#6c757d]">
              <li><strong className="text-[#1a1a1a]">Record Tampering:</strong> Physical record books and centralized SQL databases can be modified maliciously by unauthorized administrative actors.</li>
              <li><strong className="text-[#1a1a1a]">Double-Selling & Forgery:</strong> Bad actors sell the same parcel to multiple buyers simultaneously by forging paper conveyance deeds.</li>
              <li><strong className="text-[#1a1a1a]">Lack of Provenance:</strong> Verifying 30-year title history requires weeks of manual search across disparate sub-registrar offices.</li>
              <li><strong className="text-[#1a1a1a]">Undisclosed Liens:</strong> Buyers frequently discover active bank mortgages or court stay orders only after paying full property consideration.</li>
            </ul>
          </div>

          {/* Section 3: Proposed Architecture & Workflows */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1a1a1a] mb-2">3. Proposed System Architecture</h3>
            <p className="mb-2">
              The application implements a strict maker-checker workflow separating parcel registration from survey verification and mortgage management:
            </p>
            <div className="bg-[#f8f9fa] p-4 rounded-xl border border-[#e9ecef] font-mono text-[11px] text-[#1a1a1a] space-y-1 font-semibold">
              <p>1. Land Authority / Registrar → registerParcel() → [Status: REGISTERED, verified: false]</p>
              <p>2. Cadastral Surveyor → verifyProperty() → [Status: VERIFIED, verified: true]</p>
              <p>3. Bank / Legal Notary → addEncumbrance() → [Status: ENCUMBERED, transfers locked]</p>
              <p>4. Notary releases lien → releaseEncumbrance() → [Status: VERIFIED, unlocked]</p>
              <p>5. Current Owner → transferTitle() → [New Title Issued, History Appended]</p>
            </div>
          </div>

          {/* Section 4: Real-World Considerations & "Garbage In, Garbage Out" */}
          <div className="p-4 bg-[#fff9db] rounded-xl border border-[#ffec99]">
            <h3 className="text-xs font-bold text-[#f59f00] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-[#f59f00]" />
              <span>4. Real-World Legal Limitations & The "Garbage In, Garbage Out" Reality</span>
            </h3>
            <p className="text-[#495057] mb-2 font-medium">
              A common misconception is that putting land on a blockchain automatically makes property ownership legally valid. In reality:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-[#6c757d]">
              <li><strong className="text-[#1a1a1a]">The Oracle / Ground Truth Problem:</strong> Blockchain guarantees immutability of the data entered, but cannot verify whether the initial deed entered was authentic or if boundaries overlap in physical terrain (Garbage In, Garbage Out).</li>
              <li><strong className="text-[#1a1a1a]">Legal Jurisdiction:</strong> Real property ownership is governed by municipal statutory laws, court orders, inheritance disputes, and compulsory government acquisitions (Eminent Domain).</li>
              <li><strong className="text-[#1a1a1a]">Identity Bridges:</strong> Production implementations require binding Ethereum private keys to state-approved biometric Citizen DIDs (e.g. DigiLocker, Aadhaar e-Sign) to prevent loss of inheritance upon key loss.</li>
            </ul>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: DAY-WISE DEVELOPMENT TIMELINE (PDF Section 23) */}
      {activeSubTab === 'timeline' && (
        <div className="bg-white border border-[#e9ecef] rounded-xl p-6 shadow-xs space-y-6">
          <div>
            <h2 className="text-base font-bold text-[#1a1a1a] tracking-tight">
              Day-Wise Proof-Building Strategy (12-Day Development Log)
            </h2>
            <p className="text-xs text-[#6c757d] mt-1 font-medium">
              Chronological proof of work demonstrating systematic smart contract development, test suites, and frontend integration.
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
                      COMPLETED
                    </span>
                  </div>

                  <p className="text-[#6c757d] text-[11px] mb-2 font-medium">{item.desc}</p>

                  <div className="p-2 bg-white rounded-lg border border-[#ced4da] font-mono text-[10px] text-[#495057] flex items-center justify-between font-semibold">
                    <span>Commit: "{item.commit}"</span>
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
