import React, { useState } from 'react';
import {
  TestTube2,
  Copy,
  Check,
  ChevronRight,
  Sparkles,
  Info,
} from 'lucide-react';

interface SampleInputsGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: string) => void;
}

export const SampleInputsGuideModal: React.FC<SampleInputsGuideModalProps> = ({
  isOpen,
  onClose,
  onSelectTab,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const sampleSections = [
    {
      id: 'authority-reg',
      tabId: 'authority',
      category: 'authority',
      title: '1. Registrar (Animesh): Register New Property Inputs',
      description: 'Test adding a new land plot to the smart contract. Requires the Registrar account.',
      roleNeeded: 'Animesh - Registrar (0xf39F...2266)',
      presets: [
        {
          name: 'Preset A: Residential Plot (Kanpur)',
          inputs: {
            'Property ID': 'PROP-UP-KAN-005',
            'Plot / House No': 'Plot 78B, Swaroop Nagar',
            'Survey / Khasra No': 'Survey-982/2026',
            'Location': 'Swaroop Nagar, Kanpur, Uttar Pradesh',
            'State': 'Uttar Pradesh',
            'District': 'Kanpur Nagar',
            'Area (Sq. Ft.)': '3200',
            'Property Type': 'RESIDENTIAL',
            'GeoHash': 'tu4q9z55',
            'Document SHA-256': '9e2d9b62a4f65c1928374d82f1b0a3c749210e39b4d7f8c12a647d9283f4e190',
            'Owner Wallet (Ayushhh)': '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
            'Deed IPFS Link': 'ipfs://initial-deed-kanpur-official',
          },
        },
        {
          name: 'Preset B: Commercial IT Plot (Noida Sector 62)',
          inputs: {
            'Property ID': 'PROP-UP-NOI-008',
            'Plot / House No': 'Tower C, Sector 62 IT Park',
            'Survey / Khasra No': 'Survey-44/1A',
            'Location': 'Sector 62, Noida, Uttar Pradesh',
            'State': 'Uttar Pradesh',
            'District': 'Gautam Buddha Nagar',
            'Area (Sq. Ft.)': '12500',
            'Property Type': 'COMMERCIAL',
            'GeoHash': 'ttpg4c99',
            'Document SHA-256': '3a1f8b90c1e842367d5e4b99810a9c77610e2410a8b9c1d044ef1a01c45d3e89',
            'Owner Wallet (Kartikey)': '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65',
            'Deed IPFS Link': 'ipfs://initial-deed-noida-official',
          },
        },
        {
          name: 'Preset C: Farmland Plot (Rooma, Kanpur)',
          inputs: {
            'Property ID': 'PROP-UP-KAN-012',
            'Plot / House No': 'Khasra No. 142, Rooma Highway',
            'Survey / Khasra No': 'Khasra-142/2',
            'Location': 'Rooma, Kanpur Nagar, Uttar Pradesh',
            'State': 'Uttar Pradesh',
            'District': 'Kanpur Nagar',
            'Area (Sq. Ft.)': '25000',
            'Property Type': 'AGRICULTURAL',
            'GeoHash': 'tu4q8x22',
            'Document SHA-256': 'b5c2d89f01e74928374d82f1b0a3c749210e39b4d7f8c12a647d9283f4e190a1',
            'Owner Wallet (Ayushhh)': '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
            'Deed IPFS Link': 'ipfs://initial-deed-rooma-official',
          },
        },
      ],
    },
    {
      id: 'authority-survey',
      tabId: 'authority',
      category: 'authority',
      title: '2. Land Surveyor (Harsh): Verify Property Boundaries',
      description: 'Approve physical boundaries of a registered plot so the owner is allowed to sell/transfer it.',
      roleNeeded: 'Harsh - Surveyor (0x7099...79C8)',
      presets: [
        {
          name: 'Sample Unverified Plot to Approve',
          inputs: {
            'Property to Verify': 'PROP-UP-KAN-003 (Near Axis Colleges, Rooma, Kanpur)',
            'Current Status': 'REGISTERED (Unverified - Transfer Blocked)',
            'Steps': 'Switch account to Harsh (Surveyor) -> Open Authority Portal -> Click "Approve & Verify"',
            'Expected Result': 'Status changes to VERIFIED on the blockchain.',
          },
        },
      ],
    },
    {
      id: 'authority-encumbrance',
      tabId: 'authority',
      category: 'authority',
      title: '3. Bank & Legal Officer (Divyanshh): Loan Locks',
      description: 'Lock a property if it has an active bank loan, or unlock it once the loan is paid off.',
      roleNeeded: 'Divyanshh - Bank Officer (0x3C44...93BC)',
      presets: [
        {
          name: 'Sample 1: Attach Bank Home Loan Lock',
          inputs: {
            'Target Property ID': 'PROP-UP-KAN-001',
            'Lock Type': 'MORTGAGE',
            'Reference Number': 'SBI-HOMELOAN-KAN-2026-8841',
            'Details': 'Home loan of ₹45 Lakhs active on this plot.',
          },
        },
        {
          name: 'Sample 2: Clear Loan & Unlock PROP-UP-NOI-002',
          inputs: {
            'Target Property ID': 'PROP-UP-NOI-002 (Sector 62, Noida)',
            'Current Status': 'ENCUMBERED (Locked due to active loan)',
            'Steps': 'Switch account to Divyanshh -> Go to Authority Portal -> Click "Clear Loan & Unlock"',
            'Expected Result': 'Loan lock is removed and Ayushhh can now transfer the property.',
          },
        },
      ],
    },
    {
      id: 'owner-transfer',
      tabId: 'owner',
      category: 'owner',
      title: '4. Property Owner (Ayushhh): Transfer Ownership to Buyer',
      description: 'Transfer a verified, loan-free property to Kartikey (Buyer).',
      roleNeeded: 'Ayushhh - Owner (0x90F7...b906)',
      presets: [
        {
          name: 'Positive Test: Valid Ownership Transfer',
          inputs: {
            'Select Property': 'PROP-UP-KAN-001 (Civil Lines, Kanpur)',
            'Buyer Wallet (Kartikey)': '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65',
            'Sale Deed Link': 'ipfs://sale-deed-transfer-2026',
            'Security Checks': '1. Owner: PASS | 2. Verified: PASS | 3. Loan-Free: PASS | 4. Valid Buyer: PASS',
          },
        },
        {
          name: 'Negative Test: Try Selling a Mortgaged Plot (Blocked)',
          inputs: {
            'Select Property': 'PROP-UP-NOI-002 (Sector 62, Noida)',
            'Buyer Wallet (Kartikey)': '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65',
            'Expected Result': 'Check #3 fails ("Active loan lock"). Smart contract blocks the sale.',
          },
        },
      ],
    },
    {
      id: 'document-hasher',
      tabId: 'hasher',
      category: 'hasher',
      title: '5. Document Hasher: SHA-256 Tamper Detection Test',
      description: 'Check if off-chain property papers match the SHA-256 fingerprint saved on the blockchain.',
      roleNeeded: 'Any Account',
      presets: [
        {
          name: 'Tamper Detection Demo Steps',
          inputs: {
            'Target Property': 'PROP-UP-KAN-001 (Civil Lines, Kanpur)',
            'Step 1': 'Open the Document Hasher tab to see the original matching green SHA-256 hash.',
            'Step 2': 'Change a single number in the JSON text (for example, change areaSqFt from 3600 to 5000).',
            'Expected Result': 'The hash immediately changes and shows a Red "Tampering Detected" alert.',
          },
        },
      ],
    },
    {
      id: 'public-explorer',
      tabId: 'explorer',
      category: 'explorer',
      title: '6. Public Explorer: Search Keywords',
      description: 'Search terms to quickly find properties and view their past ownership history.',
      roleNeeded: 'Public Access',
      presets: [
        {
          name: 'Quick Search Keywords',
          inputs: {
            'By Property ID': 'PROP-UP-KAN-001  or  PROP-UP-NOI-002  or  PROP-UP-LKO-004',
            'By Location': 'Kanpur  or  Noida  or  Rooma  or  Lucknow',
            'By Owner Name': 'Ayushhh  or  Kartikey',
            'By Owner Wallet': '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
          },
        },
      ],
    },
  ];

  const filteredSections =
    activeCategory === 'all'
      ? sampleSections
      : sampleSections.filter(s => s.category === activeCategory);

  return (
    <div className="fixed inset-0 z-50 bg-[#1a1a1a]/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-[#ced4da] rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-[#e9ecef] flex items-center justify-between bg-[#fafbfc]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1a1a1a] text-white flex items-center justify-center">
              <TestTube2 className="w-4 h-4 text-[#0ca678]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1a1a1a]">
                Project Demo & Sample Inputs Guide
              </h2>
              <p className="text-xs text-[#6c757d]">
                Ready-to-use sample inputs, team roles, and test cases for demonstrating the project.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white hover:bg-[#f1f3f5] border border-[#ced4da] text-[#495057] hover:text-[#1a1a1a] flex items-center justify-center text-sm font-bold transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Filter Categories Bar */}
        <div className="px-5 py-2.5 bg-[#f8f9fa] border-b border-[#e9ecef] flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-[#6c757d] font-bold shrink-0">Filter Section:</span>
          {[
            { id: 'all', label: 'All Steps' },
            { id: 'authority', label: 'Authority Portal' },
            { id: 'owner', label: 'Owner & Transfer' },
            { id: 'hasher', label: 'Document Hasher' },
            { id: 'explorer', label: 'Public Explorer' },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-colors whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'bg-[#1a1a1a] text-white shadow-xs'
                  : 'bg-white text-[#495057] hover:text-[#1a1a1a] border border-[#ced4da]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {filteredSections.map(sec => (
            <div
              key={sec.id}
              className="bg-[#fafbfc] border border-[#e9ecef] rounded-xl p-4.5 space-y-4 shadow-xs"
            >
              {/* Section Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#e9ecef] pb-3">
                <div>
                  <h3 className="text-sm font-bold text-[#1a1a1a]">{sec.title}</h3>
                  <p className="text-xs text-[#6c757d] mt-0.5">{sec.description}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#f1f3f5] text-[#495057] border border-[#e9ecef] font-semibold">
                    Role: {sec.roleNeeded}
                  </span>
                  <button
                    onClick={() => {
                      onSelectTab(sec.tabId);
                      onClose();
                    }}
                    className="flex items-center gap-1 px-3 py-1 rounded-lg bg-[#1a1a1a] hover:bg-[#2d3436] text-white text-xs font-bold transition-colors shadow-xs"
                  >
                    <span>Go to Tab</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Presets List */}
              <div className="grid grid-cols-1 gap-3">
                {sec.presets.map((preset, pIdx) => (
                  <div
                    key={pIdx}
                    className="bg-white border border-[#e9ecef] rounded-lg p-3.5 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#1a1a1a] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#0ca678]" />
                        {preset.name}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
                      {Object.entries(preset.inputs).map(([key, val]) => (
                        <div
                          key={key}
                          className="bg-[#f8f9fa] p-2 rounded border border-[#e9ecef] flex flex-col justify-between"
                        >
                          <span className="text-[10px] text-[#6c757d] font-sans font-bold uppercase mb-0.5">
                            {key}:
                          </span>
                          <div className="flex items-center justify-between gap-1 text-[#1a1a1a]">
                            <span className="truncate font-semibold">{String(val)}</span>
                            <button
                              onClick={() => handleCopy(String(val), `${sec.id}-${pIdx}-${key}`)}
                              className="text-[#adb5bd] hover:text-[#0ca678] p-1 shrink-0"
                              title="Copy to clipboard"
                            >
                              {copiedKey === `${sec.id}-${pIdx}-${key}` ? (
                                <Check className="w-3.5 h-3.5 text-[#0ca678]" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#e9ecef] bg-[#fafbfc] flex items-center justify-between text-xs text-[#6c757d]">
          <div className="flex items-center gap-1.5">
            <Info className="w-4 h-4 text-[#0ca678]" />
            <span>Click any copy icon to copy values directly to your clipboard.</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#1a1a1a] hover:bg-[#2d3436] text-white text-xs font-bold transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};