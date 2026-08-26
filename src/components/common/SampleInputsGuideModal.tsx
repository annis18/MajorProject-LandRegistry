import React, { useState } from 'react';
import {
  TestTube2,
  Copy,
  Check,
  Building,
  ShieldCheck,
  ArrowRightLeft,
  Fingerprint,
  Cpu,
  Lock,
  ExternalLink,
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
      title: '1. Land Authority: Parcel Registration Inputs',
      description: 'Test smart contract parcel initialization (registerParcel). Requires Land Authority account.',
      roleNeeded: 'Land Authority (0xf39F...2266)',
      presets: [
        {
          name: 'Preset A: Residential Villa (Pune)',
          inputs: {
            'Parcel ID': 'PROP-MH-PUN-005',
            'Property / Plot No': 'Plot 78B, Koregaon Park North',
            'Survey / CTS No': 'CTS-982/2024',
            'Location': 'Koregaon Park, Pune, Maharashtra',
            'State': 'Maharashtra',
            'District': 'Pune',
            'Area (Sq. Ft.)': '4200',
            'Property Type': 'RESIDENTIAL',
            'GeoHash': 'tek3vc49p1',
            'Document SHA-256': '9e2d9b62a4f65c1928374d82f1b0a3c749210e39b4d7f8c12a647d9283f4e190',
            'Initial Owner Address': '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
            'Deed IPFS URI': 'ipfs://bafybeidemo-koregaon-deed',
            'Market Value (ETH)': '24.5',
          },
        },
        {
          name: 'Preset B: Commercial Tech Park (Bengaluru)',
          inputs: {
            'Parcel ID': 'PROP-KA-BLR-008',
            'Property / Plot No': 'Tower B, Outer Ring Road Tech Zone',
            'Survey / CTS No': 'SY-44/1A',
            'Location': 'Marathahalli-Sarjapur ORR, Bengaluru',
            'State': 'Karnataka',
            'District': 'Bengaluru Urban',
            'Area (Sq. Ft.)': '18500',
            'Property Type': 'COMMERCIAL',
            'GeoHash': 'tdr1vg89x2',
            'Document SHA-256': '3a1f8b90c1e842367d5e4b99810a9c77610e2410a8b9c1d044ef1a01c45d3e89',
            'Initial Owner Address': '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
            'Deed IPFS URI': 'ipfs://bafybeitechpark-comm-deed',
            'Market Value (ETH)': '120.0',
          },
        },
        {
          name: 'Preset C: Agricultural Farmland (Nashik)',
          inputs: {
            'Parcel ID': 'PROP-MH-NSK-012',
            'Property / Plot No': 'Gat No. 142/2, Dindori Vineyard',
            'Survey / CTS No': 'GAT-142/2',
            'Location': 'Dindori Taluka, Nashik',
            'State': 'Maharashtra',
            'District': 'Nashik',
            'Area (Sq. Ft.)': '87120',
            'Property Type': 'AGRICULTURAL',
            'GeoHash': 'teq4va11y3',
            'Document SHA-256': 'b5c2d89f01e74928374d82f1b0a3c749210e39b4d7f8c12a647d9283f4e190a1',
            'Initial Owner Address': '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
            'Deed IPFS URI': 'ipfs://bafybeifarm-nashik-deed',
            'Market Value (ETH)': '14.0',
          },
        },
      ],
    },
    {
      id: 'authority-survey',
      tabId: 'authority',
      category: 'authority',
      title: '2. Cadastral Surveyor: Physical Boundary Verification',
      description: 'Execute verifyProperty(parcelId) to validate ground physical bounds and enable title transfers.',
      roleNeeded: 'Cadastral Surveyor (0x90F7...b906)',
      presets: [
        {
          name: 'Verification Target Sample',
          inputs: {
            'Target Parcel to Verify': 'PROP-MH-PUN-004',
            'Current State': 'Pending Verification (Transfer locked)',
            'Action': 'Switch wallet to Cadastral Surveyor -> Scroll to Surveyor Verification Queue -> Click Verify Survey & Bounds',
            'Expected Result': 'Status flips to VERIFIED on blockchain, emitting PropertyVerified event.',
          },
        },
      ],
    },
    {
      id: 'authority-encumbrance',
      tabId: 'authority',
      category: 'authority',
      title: '3. Legal Notary / Bank: Encumbrance Management',
      description: 'Execute addEncumbrance to lock transfers during active bank loan, or releaseEncumbrance to clear titles.',
      roleNeeded: 'Legal Notary / Bank (0x15d3...6A65)',
      presets: [
        {
          name: 'Sample 1: Add Bank Home Loan Mortgage',
          inputs: {
            'Target Parcel ID': 'PROP-MH-PUN-001',
            'Encumbrance Kind': 'MORTGAGE',
            'Bank Sanction Reference': 'SBI-HOMELOAN-PUN-2024-8841',
            'Claim Description': 'Home improvement loan of ₹85,00,000 sanctioned with registered title deposit.',
          },
        },
        {
          name: 'Sample 2: Add Court Stay / Injunction',
          inputs: {
            'Target Parcel ID': 'PROP-MH-PUN-003',
            'Encumbrance Kind': 'COURT_STAY',
            'Sanction Reference': 'HC-BOMBAY-STAY-CIVIL-2024-109',
            'Claim Description': 'Interim civil court injunction on property mutation pending title partition suit.',
          },
        },
        {
          name: 'Sample 3: Release Mortgage on PROP-MH-PUN-002',
          inputs: {
            'Target Parcel ID': 'PROP-MH-PUN-002',
            'Current Status': 'ENCUMBERED (SBI Home Loan active)',
            'Action': 'Switch to Legal Notary -> Scroll to Active Encumbrances -> Click Release Lien',
            'Expected Result': 'Encumbrance deactivated on-chain, property becomes transferrable again.',
          },
        },
      ],
    },
    {
      id: 'owner-transfer',
      tabId: 'owner',
      category: 'owner',
      title: '4. Property Owner: On-Chain Title Conveyance (Mutation)',
      description: 'Execute smart contract ownership transfer with 4-point guard assertions. Requires property owner account.',
      roleNeeded: 'Aarav Sharma - Citizen Owner A (0x7099...79C8)',
      presets: [
        {
          name: 'Sample Positive Transfer (Clean Title)',
          inputs: {
            'Select Property': 'PROP-MH-PUN-001 (Plot 42A, Baner Hill Road)',
            'Buyer / Recipient Address': '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC (Priya Patel)',
            'Conveyance Deed IPFS URI': 'ipfs://bafybeiconveyancedeed-sale-mutation-2024',
            'Pre-Flight Security Guards': '1. Caller is Owner: PASS | 2. Verified: PASS | 3. Lien Free: PASS | 4. Valid Recipient: PASS',
          },
        },
        {
          name: 'Sample Negative Security Test (Lien Blocked)',
          inputs: {
            'Select Property': 'PROP-MH-PUN-002 (CTS 1089, Shivaji Nagar)',
            'Attempted Recipient': '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
            'Expected Security Failure': 'Guard #3 fails with "FAIL: Active Lien exists (MORTGAGE)". Smart contract automatically rejects the transfer.',
          },
        },
      ],
    },
    {
      id: 'document-hasher',
      tabId: 'hasher',
      category: 'hasher',
      title: '5. Document Hasher: Cryptographic Integrity & Tamper Test',
      description: 'Test SHA-256 cryptographic verification of off-chain deed metadata.',
      roleNeeded: 'Any Account (Public Verification)',
      presets: [
        {
          name: 'Original Genuine Deed (Valid Hash Match)',
          inputs: {
            'Target Parcel': 'PROP-MH-PUN-001',
            'On-Chain SHA-256': 'a4f8902b1c3e45d67890abcdef1234567890abcdef1234567890abcdef123456',
            'Expected Result': 'DOCUMENT AUTHENTIC & VERIFIED (Green badge)',
          },
        },
        {
          name: 'Tampered Deed Simulation',
          inputs: {
            'Action': 'Click "Simulate Tampering" button in Document Hasher tab',
            'Modification': 'Changes areaSqFt from 2400 to 3600 and injects fake owner',
            'Expected Result': 'Instant hash mismatch -> TAMPERING DETECTED / INVALID DEED (Red alert)',
          },
        },
        {
          name: 'CLI Verification Command (Terminal / Node.js)',
          inputs: {
            'OpenSSL': 'openssl dgst -sha256 property_001.json',
            'Node.js CLI': 'node -e "console.log(require(\'crypto\').createHash(\'sha256\').update(fs.readFileSync(\'property_001.json\')).digest(\'hex\'))"',
          },
        },
      ],
    },
    {
      id: 'public-explorer',
      tabId: 'explorer',
      category: 'explorer',
      title: '6. Public Title Explorer: Search & Verification Queries',
      description: 'Sample search terms to test parcel query engine, encumbrance certificates, and audit history.',
      roleNeeded: 'Public Access',
      presets: [
        {
          name: 'Quick Search Keywords',
          inputs: {
            'By Parcel ID': 'PROP-MH-PUN-001  or  PROP-MH-PUN-002  or  PROP-MH-PUN-003',
            'By Physical Location': 'Baner Hill  or  Shivaji Nagar  or  Viman Nagar',
            'By Citizen Owner': 'Aarav Sharma  or  Priya Patel',
            'By Owner Wallet': '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
            'Filter by Status': 'Select "Verified Titles", "Encumbered (Lien Active)", or "Transferred Titles"',
          },
        },
      ],
    },
    {
      id: 'hardhat-simulator',
      tabId: 'simulator',
      category: 'simulator',
      title: '7. Hardhat EVM Test Runner: Unit Test Scenarios',
      description: '16+ automated Hardhat unit tests asserting smart contract invariants.',
      roleNeeded: 'Any Account',
      presets: [
        {
          name: 'Core Invariant Test Cases',
          inputs: {
            'Test #01': 'Deployment & Role Initialization (Deployer is Registrar)',
            'Test #02': 'Authorized Parcel Registration with SHA-256 Hash',
            'Test #03': 'Reject Duplicate Parcel ID Registration (Revert: "Parcel already registered")',
            'Test #04': 'Surveyor Boundary Verification',
            'Test #05': 'Legal Notary Lien Attachment',
            'Test #06': 'Block Title Transfer with Active Encumbrance (Revert: "Property has active encumbrance")',
            'Test #07': 'Authorized Owner Title Transfer & Historical Mutation Recording',
            'Test #08': 'Reject Transfer by Non-Owner Caller (Revert: "Caller is not the property owner")',
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
                Sample Inputs & Test Scenarios Guide
              </h2>
              <p className="text-xs text-[#6c757d]">
                Ready-to-use realistic data, wallet roles, and test cases for every section of the application.
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
            { id: 'all', label: 'All Sections' },
            { id: 'authority', label: 'Authority & Encumbrance' },
            { id: 'owner', label: 'Owner & Transfer' },
            { id: 'hasher', label: 'Document Hasher' },
            { id: 'explorer', label: 'Explorer Search' },
            { id: 'simulator', label: 'Hardhat Tests' },
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
                    <span>Open Section</span>
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
