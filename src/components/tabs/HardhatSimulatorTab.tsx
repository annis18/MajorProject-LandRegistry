import React, { useState } from 'react';
import { useBlockchain } from '../../context/BlockchainContext';
import { TestCase } from '../../types';
import { shortenAddress, shortenHash, formatTimestamp } from '../../utils/crypto';
import {
  Cpu,
  Play,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  Activity,
  Terminal,
  Filter,
  Copy,
  Check,
  Zap,
} from 'lucide-react';

export const HardhatSimulatorTab: React.FC = () => {
  const {
    testCases,
    runAllTests,
    isRunningTests,
    blocks,
    transactions,
    contractAddress,
  } = useBlockchain();

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedTest, setSelectedTest] = useState<TestCase | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const filteredTests = testCases.filter(t => {
    if (selectedCategory === 'ALL') return true;
    return t.category === selectedCategory;
  });

  const passedCount = testCases.filter(t => t.status === 'PASSED').length;
  const failedCount = testCases.filter(t => t.status === 'FAILED').length;
  const totalCount = testCases.length;

  return (
    <div className="space-y-6">
      {/* Test Suite Control Header */}
      <div className="bg-white border border-[#e9ecef] rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[#0ca678]" />
            <h2 className="text-base font-bold text-[#1a1a1a] tracking-tight">
              Hardhat Automated Test Suite & Local EVM Runner
            </h2>
          </div>
          <p className="text-xs text-[#6c757d] mt-1 font-medium">
            Execute all 16+ unit tests covering registration invariants, role security, encumbrance blocking, and title mutations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-bold bg-[#f8f9fa] px-3 py-1.5 rounded-lg border border-[#ced4da]">
            <span className="text-[#0ca678]">{passedCount} Passed</span>
            <span className="text-[#adb5bd]">/</span>
            <span className="text-[#495057]">{totalCount} Tests</span>
          </div>

          <button
            onClick={runAllTests}
            disabled={isRunningTests}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#1a1a1a] hover:bg-[#2d3436] text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isRunningTests ? 'Executing Test Suite...' : 'RUN ALL HARDHAT TESTS'}</span>
          </button>
        </div>
      </div>

      {/* Tests Table & Category Filter */}
      <div className="bg-white border border-[#e9ecef] rounded-xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e9ecef] pb-4 mb-4">
          <h3 className="text-xs font-bold text-[#6c757d] uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#f59f00]" />
            <span>Unit Test Scenarios (Chai / Ethers Assertions)</span>
          </h3>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            {['ALL', 'REGISTRATION', 'VERIFICATION', 'TRANSFER', 'ENCUMBRANCE', 'SECURITY', 'HASHING'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-[#1a1a1a] text-white border border-[#1a1a1a]'
                    : 'bg-[#f8f9fa] text-[#495057] hover:text-[#1a1a1a] hover:bg-[#e9ecef] border border-[#ced4da]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Test List */}
        <div className="space-y-2.5">
          {filteredTests.map(tc => (
            <div
              key={tc.id}
              onClick={() => setSelectedTest(tc)}
              className="p-3.5 bg-[#f8f9fa] border border-[#e9ecef] hover:border-[#ced4da] rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer transition-colors group shadow-xs"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {tc.status === 'PASSED' && <CheckCircle2 className="w-4 h-4 text-[#0ca678]" />}
                  {tc.status === 'FAILED' && <AlertCircle className="w-4 h-4 text-[#e03131]" />}
                  {tc.status === 'RUNNING' && <div className="w-4 h-4 border-2 border-[#0ca678] border-t-transparent rounded-full animate-spin" />}
                  {tc.status === 'IDLE' && <Clock className="w-4 h-4 text-[#adb5bd]" />}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-[#adb5bd]">#{tc.id.toString().padStart(2, '0')}</span>
                    <h4 className="text-xs font-bold text-[#1a1a1a] group-hover:text-[#0ca678] transition-colors">
                      {tc.name}
                    </h4>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#e9ecef] text-[#495057] font-semibold">
                      {tc.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#6c757d] mt-0.5 font-medium">{tc.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end md:self-auto text-xs shrink-0">
                {tc.expectedRevert && (
                  <span className="text-[10px] font-mono text-[#e03131] bg-[#fff5f5] px-2 py-0.5 rounded border border-[#ffc9c9] font-medium">
                    Revert: "{tc.expectedRevert}"
                  </span>
                )}
                {tc.durationMs && (
                  <span className="text-[11px] font-mono text-[#6c757d] font-medium">{tc.durationMs}ms</span>
                )}
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    tc.status === 'PASSED'
                      ? 'bg-[#e6fcf5] text-[#0ca678] border border-[#b2f2bb]'
                      : tc.status === 'FAILED'
                      ? 'bg-[#fff5f5] text-[#e03131] border border-[#ffc9c9]'
                      : tc.status === 'RUNNING'
                      ? 'bg-[#fff9db] text-[#f59f00] border border-[#ffec99] animate-pulse'
                      : 'bg-[#f1f3f5] text-[#6c757d] border border-[#ced4da]'
                  }`}
                >
                  {tc.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Test Detail Modal */}
      {selectedTest && (
        <div className="fixed inset-0 z-50 bg-[#1a1a1a]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#ced4da] rounded-xl max-w-xl w-full p-6 shadow-xl space-y-4">
            <div className="flex items-start justify-between border-b border-[#e9ecef] pb-3">
              <div>
                <span className="text-[10px] uppercase font-mono font-bold text-[#0ca678] bg-[#e6fcf5] px-2 py-0.5 rounded border border-[#b2f2bb]">
                  {selectedTest.category} TEST #{selectedTest.id}
                </span>
                <h3 className="text-base font-bold text-[#1a1a1a] mt-1">{selectedTest.name}</h3>
              </div>
              <button
                onClick={() => setSelectedTest(null)}
                className="text-[#6c757d] hover:text-[#1a1a1a] p-1.5 rounded-lg bg-[#f8f9fa] border border-[#ced4da]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-[#495057]">
              <div className="p-3 bg-[#f8f9fa] rounded-lg border border-[#e9ecef]">
                <span className="text-[#6c757d] block font-bold mb-0.5">Initial Condition:</span>
                <p className="font-mono text-[#1a1a1a]">{selectedTest.initialCondition}</p>
              </div>

              <div className="p-3 bg-[#f8f9fa] rounded-lg border border-[#e9ecef]">
                <span className="text-[#6c757d] block font-bold mb-0.5">Action Executed:</span>
                <p className="font-mono text-[#0ca678] font-semibold">{selectedTest.action}</p>
              </div>

              <div className="p-3 bg-[#f8f9fa] rounded-lg border border-[#e9ecef]">
                <span className="text-[#6c757d] block font-bold mb-0.5">Expected Assertion:</span>
                <p className="font-mono text-[#1a1a1a]">{selectedTest.expectedResult}</p>
              </div>

              {selectedTest.executionLog && (
                <div className="p-3 bg-[#f8f9fa] rounded-lg border border-[#e9ecef] font-mono text-[11px] text-[#0ca678]">
                  <span className="text-[#6c757d] block font-sans font-bold mb-1">Execution Output Log:</span>
                  <p>{selectedTest.executionLog}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedTest(null)}
                className="px-4 py-1.5 bg-[#1a1a1a] hover:bg-[#2d3436] text-white rounded-lg text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EVM Block & Transaction Explorer (Bottom Split) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latest Mined Blocks */}
        <div className="bg-white border border-[#e9ecef] rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#e9ecef] pb-3 mb-3">
            <h3 className="text-xs font-bold text-[#1a1a1a] uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#0ca678]" />
              <span>Simulated Blocks Ledger ({blocks.length} Blocks)</span>
            </h3>
            <span className="text-[10px] font-mono text-[#6c757d] font-medium">Gas Target: 30,000,000</span>
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {blocks.slice().reverse().map(block => (
              <div
                key={block.blockNumber}
                className="p-3 bg-[#f8f9fa] rounded-lg border border-[#e9ecef] text-xs font-mono"
              >
                <div className="flex items-center justify-between text-[#1a1a1a] font-bold mb-1">
                  <span className="text-[#0ca678]">Block #{block.blockNumber}</span>
                  <span className="text-[10px] text-[#6c757d] font-normal">
                    {formatTimestamp(block.timestamp)}
                  </span>
                </div>
                <div className="text-[11px] text-[#6c757d] space-y-0.5">
                  <p className="truncate">Hash: <span className="text-[#1a1a1a]">{block.hash}</span></p>
                  <p className="truncate">Prev: <span className="text-[#adb5bd]">{block.previousHash}</span></p>
                  <div className="flex items-center justify-between pt-1 text-[10px]">
                    <span>Tx Count: {block.transactionsCount}</span>
                    <span className="text-[#0ca678] font-bold">Gas Used: {block.gasUsed.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transaction History Logs */}
        <div className="bg-white border border-[#e9ecef] rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#e9ecef] pb-3 mb-3">
            <h3 className="text-xs font-bold text-[#1a1a1a] uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#0ca678]" />
              <span>On-Chain Transaction Log Stream ({transactions.length} Txs)</span>
            </h3>
            <span className="text-[10px] font-mono text-[#6c757d] font-medium">Contract: {shortenAddress(contractAddress)}</span>
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {transactions.map(tx => (
              <div
                key={tx.id}
                className="p-3 bg-[#f8f9fa] rounded-lg border border-[#e9ecef] text-xs"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-[#1a1a1a] font-mono text-[11px] truncate max-w-[200px]">
                    {tx.method}
                  </span>
                  <span className="text-[10px] font-mono text-[#0ca678] bg-[#e6fcf5] px-1.5 py-0.5 rounded border border-[#b2f2bb] font-bold">
                    Block #{tx.blockNumber}
                  </span>
                </div>

                <p className="text-[#495057] text-[11px] mb-1 font-medium">{tx.details}</p>

                <div className="flex items-center justify-between text-[10px] text-[#6c757d] font-mono font-medium">
                  <span className="truncate max-w-[150px]">From: {tx.fromName}</span>
                  <span className="text-[#0ca678] truncate max-w-[150px] font-bold">{shortenHash(tx.txHash)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
