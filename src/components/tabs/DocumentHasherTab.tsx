import React, { useState, useEffect } from 'react';
import { useBlockchain } from '../../context/BlockchainContext';
import { DUMMY_PROPERTY_001_JSON } from '../../data/mockData';
import { generateSha256 } from '../../utils/crypto';
import {
  FileCheck2,
  Fingerprint,
  ShieldCheck,
  ShieldAlert,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  Copy,
  Check,
  Terminal,
  FileCode2,
  HelpCircle,
} from 'lucide-react';

export const DocumentHasherTab: React.FC = () => {
  const { properties } = useBlockchain();
  const targetProperty = properties.find(p => p.parcelId === 'PROP-MH-PUN-001') || properties[0];

  const [documentContent, setDocumentContent] = useState<string>(
    JSON.stringify(DUMMY_PROPERTY_001_JSON, null, 2)
  );
  const [currentHash, setCurrentHash] = useState<string>('');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  // Expected on-chain hash
  const onChainHash = targetProperty?.documentHash || '0xa4b19d85c8f42ef4f169f44efea6e866e4a2c5957d07936a19f2be17dc3e0d84';

  // Compute hash on document content change
  useEffect(() => {
    let isMounted = true;
    generateSha256(documentContent).then(h => {
      if (isMounted) setCurrentHash(h);
    });
    return () => {
      isMounted = false;
    };
  }, [documentContent]);

  const isMatching = currentHash.toLowerCase() === onChainHash.toLowerCase();

  const handleTamperSimulation = () => {
    try {
      const parsed = JSON.parse(documentContent);
      parsed.surveyNumber = 'Survey 45, Hissa 99 (TAMPERED BY FRAUDULENT SELLER)';
      parsed.cadastralBoundaries.north = 'CTS Plot 99/99 (UNAUTHORIZED EXTENSION)';
      setDocumentContent(JSON.stringify(parsed, null, 2));
    } catch {
      setDocumentContent(prev => prev + ' // TAMPERED');
    }
  };

  const handleResetDocument = () => {
    setDocumentContent(JSON.stringify(DUMMY_PROPERTY_001_JSON, null, 2));
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(text);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Educational Banner: Why Off-Chain Document Storage? (PDF Section 15) */}
      <div className="bg-white border border-[#e9ecef] rounded-xl p-6 shadow-xs">
        <div className="flex items-start gap-3">
          <Fingerprint className="w-5 h-5 text-[#0ca678] shrink-0 mt-0.5" />
          <div>
            <h2 className="text-base font-bold text-[#1a1a1a] tracking-tight">
              Document Hashing & Cryptographic Integrity Verification
            </h2>
            <p className="text-xs text-[#495057] mt-1 leading-relaxed">
              Why do property deeds and survey blueprints remain off-chain? Storing large PDF files or survey blueprints directly on the Ethereum EVM is cost-prohibitive in gas fees and violates citizen data privacy. Instead, a unique <strong>SHA-256 cryptographic digest</strong> of the document is recorded on the smart contract. Any unauthorized modification to even a single character in the deed creates a completely different hash, immediately revealing forgery.
            </p>
          </div>
        </div>
      </div>

      {/* Live Hasher & Tamper Detection Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Document Editor */}
        <div className="lg:col-span-7 bg-white border border-[#e9ecef] rounded-xl p-5 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between border-b border-[#e9ecef] pb-3 mb-3">
              <div className="flex items-center gap-2">
                <FileCode2 className="w-4 h-4 text-[#0ca678]" />
                <span className="text-xs font-bold text-[#1a1a1a] font-mono">property_001.json (Deed Metadata)</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleTamperSimulation}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#fff5f5] hover:bg-[#ffe3e3] text-[#e03131] border border-[#ffc9c9] text-xs font-bold transition-colors"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Simulate Tampering</span>
                </button>
                <button
                  onClick={handleResetDocument}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#f8f9fa] hover:bg-[#e9ecef] text-[#495057] border border-[#ced4da] text-xs font-bold transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Original</span>
                </button>
              </div>
            </div>

            <p className="text-[11px] text-[#6c757d] mb-2 font-medium">
              Edit the JSON below directly or click "Simulate Tampering" to see real-time SHA-256 hash recalculation:
            </p>

            <textarea
              rows={14}
              value={documentContent}
              onChange={e => setDocumentContent(e.target.value)}
              className="w-full bg-[#f8f9fa] border border-[#ced4da] rounded-lg p-3.5 text-xs font-mono text-[#1a1a1a] focus:bg-white focus:outline-none focus:border-[#1a1a1a] selection:bg-[#b2f2bb]"
            />
          </div>

          <div className="mt-3 pt-3 border-t border-[#f1f3f5] flex items-center justify-between text-xs text-[#6c757d] font-mono">
            <span>Encoding: UTF-8</span>
            <span>Target Parcel: {targetProperty.parcelId}</span>
          </div>
        </div>

        {/* Right Column: Hash Comparison & Tamper Verdict */}
        <div className="lg:col-span-5 space-y-4">
          {/* Comparison Card */}
          <div className="bg-white border border-[#e9ecef] rounded-xl p-5 shadow-xs">
            <h3 className="text-xs font-bold text-[#6c757d] uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Fingerprint className="w-4 h-4 text-[#0ca678]" />
              <span>Cryptographic Hash Integrity Verdict</span>
            </h3>

            {/* Verdict Box */}
            <div
              className={`p-4 rounded-xl border mb-5 flex items-start gap-3 ${
                isMatching
                  ? 'bg-[#e6fcf5] border-[#b2f2bb] text-[#0ca678]'
                  : 'bg-[#fff5f5] border-[#ffc9c9] text-[#e03131]'
              }`}
            >
              {isMatching ? (
                <ShieldCheck className="w-5 h-5 text-[#0ca678] shrink-0 mt-0.5" />
              ) : (
                <ShieldAlert className="w-5 h-5 text-[#e03131] shrink-0 mt-0.5" />
              )}
              <div>
                <h4 className="text-xs font-bold tracking-tight uppercase">
                  {isMatching ? 'DOCUMENT AUTHENTIC & VERIFIED' : 'TAMPERING DETECTED / INVALID DEED'}
                </h4>
                <p className="text-xs mt-1 text-[#495057] leading-relaxed">
                  {isMatching
                    ? 'The computed document SHA-256 hash matches the on-chain smart contract record bit-for-bit. The physical boundaries and survey records are genuine.'
                    : 'The computed hash diverges from the immutable on-chain record. The file has been altered after registration and must be rejected.'}
                </p>
              </div>
            </div>

            {/* Hashes Breakdown */}
            <div className="space-y-3 text-xs">
              {/* Expected On-Chain Hash */}
              <div className="p-3 bg-[#f8f9fa] rounded-lg border border-[#e9ecef]">
                <div className="flex items-center justify-between text-[#6c757d] mb-1">
                  <span className="font-bold text-[#0ca678]">1. On-Chain Committed Hash:</span>
                  <button
                    onClick={() => handleCopy(onChainHash)}
                    className="text-[#adb5bd] hover:text-[#1a1a1a]"
                  >
                    {copiedHash === onChainHash ? <Check className="w-3.5 h-3.5 text-[#0ca678]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="font-mono text-[11px] text-[#1a1a1a] font-semibold break-all">{onChainHash}</p>
              </div>

              {/* Computed Document Hash */}
              <div className="p-3 bg-[#f8f9fa] rounded-lg border border-[#e9ecef]">
                <div className="flex items-center justify-between text-[#6c757d] mb-1">
                  <span className={`font-bold ${isMatching ? 'text-[#0ca678]' : 'text-[#e03131]'}`}>
                    2. Computed SHA-256 Hash:
                  </span>
                  <button
                    onClick={() => handleCopy(currentHash)}
                    className="text-[#adb5bd] hover:text-[#1a1a1a]"
                  >
                    {copiedHash === currentHash ? <Check className="w-3.5 h-3.5 text-[#0ca678]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="font-mono text-[11px] text-[#1a1a1a] font-semibold break-all">{currentHash}</p>
              </div>
            </div>
          </div>

          {/* Terminal / CLI Verification Commands (PDF Section 15) */}
          <div className="bg-white border border-[#e9ecef] rounded-xl p-5 shadow-xs">
            <h4 className="text-xs font-bold text-[#1a1a1a] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-[#0ca678]" />
              <span>Independent CLI Hash Commands</span>
            </h4>
            <p className="text-[11px] text-[#6c757d] mb-3 font-medium">
              Verify this JSON hash independently in your terminal without any web interface:
            </p>

            <div className="space-y-2 font-mono text-[11px]">
              <div className="bg-[#f8f9fa] p-2.5 rounded-lg border border-[#e9ecef] text-[#1a1a1a] flex items-center justify-between">
                <code className="text-xs">openssl dgst -sha256 property_001.json</code>
                <button
                  onClick={() => handleCopy('openssl dgst -sha256 property_001.json')}
                  className="text-[#adb5bd] hover:text-[#0ca678]"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="bg-[#f8f9fa] p-2.5 rounded-lg border border-[#e9ecef] text-[#1a1a1a] flex items-center justify-between">
                <code className="text-xs truncate mr-2">node -e "console.log(require('crypto').createHash('sha256').update(fs.readFileSync('property_001.json')).digest('hex'))"</code>
                <button
                  onClick={() => handleCopy("node -e \"console.log(require('crypto').createHash('sha256').update(fs.readFileSync('property_001.json')).digest('hex'))\"")}
                  className="text-[#adb5bd] hover:text-[#0ca678] shrink-0"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
