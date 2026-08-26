import React, { useState } from 'react';
import { useBlockchain } from '../../context/BlockchainContext';
import { Property } from '../../types';
import { shortenAddress, formatTimestamp } from '../../utils/crypto';
import {
  Building2,
  ArrowRightLeft,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Unlock,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  Sparkles,
  ArrowRight,
  Info,
} from 'lucide-react';

interface OwnerDashboardProps {
  onNotify: (type: 'success' | 'error' | 'info', title: string, message: string, txHash?: string) => void;
}

export const OwnerDashboardTab: React.FC<OwnerDashboardProps> = ({ onNotify }) => {
  const {
    properties,
    currentAccount,
    setCurrentAccount,
    accounts,
    transferOwnership,
  } = useBlockchain();

  // Filter properties belonging to current account
  const myProperties = properties.filter(
    p => p.currentOwner.toLowerCase() === currentAccount.address.toLowerCase()
  );

  // Transfer modal / form state
  const [selectedParcelId, setSelectedParcelId] = useState<string>(myProperties[0]?.parcelId || '');
  const [recipientAddress, setRecipientAddress] = useState<string>(accounts[4]?.address || '');
  const [customDeedURI, setCustomDeedURI] = useState<string>('');
  const [isTransferring, setIsTransferring] = useState(false);
  const [transferError, setTransferError] = useState<string | null>(null);

  // Target property object
  const activeParcel = properties.find(p => p.parcelId === selectedParcelId) || myProperties[0];

  // Pre-flight checks
  const isVerified = activeParcel?.verified;
  const hasActiveLien = activeParcel?.encumbrances.some(e => e.active);
  const isCurrentOwner = activeParcel?.currentOwner.toLowerCase() === currentAccount.address.toLowerCase();
  const isValidRecipient = recipientAddress.startsWith('0x') && recipientAddress.length === 42 && recipientAddress.toLowerCase() !== activeParcel?.currentOwner.toLowerCase();
  const canTransfer = isVerified && !hasActiveLien && isCurrentOwner && isValidRecipient;

  // Load sample transfer to Priya Patel
  const handleLoadSampleTransfer = () => {
    if (myProperties.length > 0) {
      setSelectedParcelId(myProperties[0].parcelId);
    }
    setRecipientAddress(accounts[4].address); // Priya Patel
    setCustomDeedURI('ipfs://conveyance-sale-deed-registered-2026');
    setTransferError(null);
    onNotify('info', 'Sample Transfer Loaded', 'Populated transfer form with Buyer B (Priya Patel).');
  };

  const handleTransferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTransferError(null);

    if (!selectedParcelId) {
      setTransferError('Please select a property parcel to transfer.');
      return;
    }

    if (!recipientAddress.trim() || !recipientAddress.startsWith('0x')) {
      setTransferError('Please enter a valid Ethereum address for the new owner.');
      return;
    }

    setIsTransferring(true);
    const result = await transferOwnership({
      parcelId: selectedParcelId,
      newOwnerAddress: recipientAddress.trim(),
      newDeedURI: customDeedURI || undefined,
    });
    setIsTransferring(false);

    if (result.success) {
      onNotify('success', 'Title Transferred', result.message, result.txHash);
      setCustomDeedURI('');
    } else {
      setTransferError(result.message);
      onNotify('error', 'Transfer Reverted', result.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Identity & Quick Switcher */}
      <div className="bg-white border border-[#e9ecef] rounded-xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#fff9db] text-[#f59f00] border border-[#ffec99]">
                CITIZEN OWNER VIEW
              </span>
              <h2 className="text-base font-bold text-[#1a1a1a] tracking-tight">
                {currentAccount.name}
              </h2>
            </div>
            <p className="text-xs font-mono text-[#6c757d] mt-1">
              Active Wallet: <span className="text-[#1a1a1a] font-semibold">{currentAccount.address}</span>
            </p>
          </div>

          {/* Quick Account Switcher Buttons */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#6c757d] font-bold hidden sm:inline">Switch Citizen:</span>
            <button
              onClick={() => setCurrentAccount(accounts[3])} // Aarav Sharma
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                currentAccount.address === accounts[3].address
                  ? 'bg-[#1a1a1a] text-white border-[#1a1a1a] shadow-xs'
                  : 'bg-[#f8f9fa] text-[#495057] hover:text-[#1a1a1a] hover:bg-[#e9ecef] border-[#ced4da]'
              }`}
            >
              Aarav Sharma (Owner A)
            </button>
            <button
              onClick={() => setCurrentAccount(accounts[4])} // Priya Patel
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                currentAccount.address === accounts[4].address
                  ? 'bg-[#1a1a1a] text-white border-[#1a1a1a] shadow-xs'
                  : 'bg-[#f8f9fa] text-[#495057] hover:text-[#1a1a1a] hover:bg-[#e9ecef] border-[#ced4da]'
              }`}
            >
              Priya Patel (Buyer B)
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 1: My Owned Properties */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-[#1a1a1a] uppercase tracking-wider flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#0ca678]" />
            <span>My Registered Titles ({myProperties.length})</span>
          </h3>
          <span className="text-xs text-[#6c757d] font-medium">
            Ownership proven by on-chain <code className="text-[#0ca678] font-bold">currentTitle[parcelId].owner</code>
          </span>
        </div>

        {myProperties.length === 0 ? (
          <div className="bg-white border border-dashed border-[#ced4da] p-8 rounded-xl text-center">
            <Building2 className="w-10 h-10 text-[#adb5bd] mx-auto mb-2" />
            <h4 className="text-sm font-bold text-[#1a1a1a]">No Properties Owned by This Account</h4>
            <p className="text-xs text-[#6c757d] mt-1 max-w-md mx-auto">
              Switch to "Aarav Sharma" or register a new property in the Authority Portal to see assets here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myProperties.map(prop => {
              const hasLien = prop.encumbrances.some(e => e.active);
              return (
                <div
                  key={prop.parcelId}
                  className="bg-white border border-[#e9ecef] hover:border-[#ced4da] rounded-xl p-5 flex flex-col justify-between shadow-xs"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-xs font-mono font-bold text-[#0ca678] bg-[#e6fcf5] px-2 py-0.5 rounded border border-[#b2f2bb]">
                          {prop.parcelId}
                        </span>
                        <h4 className="text-base font-bold text-[#1a1a1a] mt-1">{prop.propertyNumber}</h4>
                        <p className="text-xs text-[#6c757d] font-medium">{prop.location}</p>
                      </div>

                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#f1f3f5] text-[#495057] border border-[#e9ecef]">
                        {prop.propertyType}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 my-3 p-3 bg-[#f8f9fa] rounded-lg border border-[#e9ecef] text-xs">
                      <div>
                        <span className="text-[#6c757d] block font-medium">Area</span>
                        <span className="font-bold text-[#1a1a1a]">{prop.areaSqFt.toLocaleString()} sq.ft.</span>
                      </div>
                      <div>
                        <span className="text-[#6c757d] block font-medium">Status</span>
                        <span className="font-bold text-[#1a1a1a]">{prop.status}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#f1f3f5] flex items-center justify-between">
                    <div>
                      {hasLien ? (
                        <span className="text-[11px] text-[#e03131] font-bold flex items-center gap-1">
                          <Lock className="w-3.5 h-3.5" /> Transfer Blocked (Lien)
                        </span>
                      ) : prop.verified ? (
                        <span className="text-[11px] text-[#0ca678] font-bold flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" /> Ready for Transfer
                        </span>
                      ) : (
                        <span className="text-[11px] text-[#f59f00] font-bold flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> Pending Verification
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        setSelectedParcelId(prop.parcelId);
                        window.scrollTo({ top: 500, behavior: 'smooth' });
                      }}
                      className="text-xs font-bold text-[#1a1a1a] hover:text-[#0ca678] flex items-center gap-1 transition-colors"
                    >
                      <span>Select to Transfer</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SECTION 2: Transfer Title Workflow */}
      <div className="bg-white border border-[#e9ecef] rounded-xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e9ecef] pb-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#0ca678] bg-[#e6fcf5] px-2 py-0.5 rounded border border-[#b2f2bb]">
                STEP 3
              </span>
              <h3 className="text-base font-bold text-[#1a1a1a] tracking-tight">
                Initiate Ownership Transfer (Mutation)
              </h3>
            </div>
            <p className="text-xs text-[#6c757d] mt-0.5 font-medium">
              Execute smart contract title conveyance with automated multi-point security validations.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLoadSampleTransfer}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#e6fcf5] hover:bg-[#b2f2bb] text-[#0ca678] border border-[#b2f2bb] text-xs font-bold transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>LOAD SAMPLE TRANSFER</span>
          </button>
        </div>

        {transferError && (
          <div className="mb-5 p-3 rounded-xl bg-[#fff5f5] border border-[#ffc9c9] text-[#e03131] text-xs flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 text-[#e03131] shrink-0" />
            <span>{transferError}</span>
          </div>
        )}

        <form onSubmit={handleTransferSubmit} className="space-y-6">
          {/* Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#495057] mb-1">
                Select Property to Transfer <span className="text-[#e03131]">*</span>
              </label>
              <select
                value={selectedParcelId}
                onChange={e => setSelectedParcelId(e.target.value)}
                className="w-full bg-[#f8f9fa] border border-[#ced4da] rounded-lg px-3.5 py-2 text-xs text-[#1a1a1a] focus:bg-white focus:outline-none focus:border-[#1a1a1a]"
                required
              >
                <option value="">-- Choose from your parcels --</option>
                {properties.map(p => (
                  <option key={p.parcelId} value={p.parcelId}>
                    {p.parcelId} — {p.propertyNumber} ({p.currentOwnerName})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#495057] mb-1">
                Buyer / Recipient Wallet Address <span className="text-[#e03131]">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="0x..."
                  value={recipientAddress}
                  onChange={e => setRecipientAddress(e.target.value)}
                  className="flex-1 bg-[#f8f9fa] border border-[#ced4da] rounded-lg px-3.5 py-2 text-xs text-[#1a1a1a] focus:bg-white focus:outline-none focus:border-[#1a1a1a] font-mono"
                  required
                />
                <button
                  type="button"
                  onClick={() => setRecipientAddress(accounts[4].address)}
                  className="px-2.5 py-2 bg-[#f8f9fa] hover:bg-[#e9ecef] text-[11px] rounded-lg text-[#495057] border border-[#ced4da] font-bold transition-colors"
                >
                  Set Priya (Buyer)
                </button>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#495057] mb-1">
                New Conveyance Deed IPFS URI
              </label>
              <input
                type="text"
                placeholder="ipfs://bafybeiconveyancedeed..."
                value={customDeedURI}
                onChange={e => setCustomDeedURI(e.target.value)}
                className="w-full bg-[#f8f9fa] border border-[#ced4da] rounded-lg px-3.5 py-2 text-xs text-[#1a1a1a] focus:bg-white focus:outline-none focus:border-[#1a1a1a] font-mono"
              />
            </div>
          </div>

          {/* Pre-Flight Smart Contract Security Checks Matrix */}
          <div className="p-4 bg-[#f8f9fa] rounded-xl border border-[#e9ecef]">
            <h4 className="text-xs font-bold text-[#6c757d] uppercase tracking-wider mb-3">
              Pre-Flight Smart Contract Guard Assertions
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2">
                {isCurrentOwner ? (
                  <CheckCircle2 className="w-4 h-4 text-[#0ca678] shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-[#e03131] shrink-0" />
                )}
                <span className={isCurrentOwner ? 'text-[#495057] font-medium' : 'text-[#e03131] font-bold'}>
                  1. Caller is current active owner ({isCurrentOwner ? 'PASS' : 'FAIL: Not owner'})
                </span>
              </div>

              <div className="flex items-center gap-2">
                {isVerified ? (
                  <CheckCircle2 className="w-4 h-4 text-[#0ca678] shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-[#f59f00] shrink-0" />
                )}
                <span className={isVerified ? 'text-[#495057] font-medium' : 'text-[#f59f00] font-bold'}>
                  2. Property is officially verified ({isVerified ? 'PASS' : 'FAIL: Unverified'})
                </span>
              </div>

              <div className="flex items-center gap-2">
                {!hasActiveLien ? (
                  <CheckCircle2 className="w-4 h-4 text-[#0ca678] shrink-0" />
                ) : (
                  <Lock className="w-4 h-4 text-[#e03131] shrink-0" />
                )}
                <span className={!hasActiveLien ? 'text-[#495057] font-medium' : 'text-[#e03131] font-bold'}>
                  3. Encumbrance & Mortgage free ({!hasActiveLien ? 'PASS' : 'FAIL: Active Lien exists'})
                </span>
              </div>

              <div className="flex items-center gap-2">
                {isValidRecipient ? (
                  <CheckCircle2 className="w-4 h-4 text-[#0ca678] shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-[#e03131] shrink-0" />
                )}
                <span className={isValidRecipient ? 'text-[#495057] font-medium' : 'text-[#e03131] font-bold'}>
                  4. Valid new owner wallet ({isValidRecipient ? 'PASS' : 'FAIL: Invalid/same address'})
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="text-xs text-[#6c757d]">
              {canTransfer ? (
                <span className="text-[#0ca678] font-bold">✓ All guard conditions satisfied. Ready for on-chain execution.</span>
              ) : (
                <span className="text-[#e03131] font-medium">✗ Fix the highlighted failed security check(s) above before submitting.</span>
              )}
            </div>

            <button
              type="submit"
              disabled={isTransferring}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#1a1a1a] hover:bg-[#2d3436] text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50"
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>{isTransferring ? 'Executing Mutation...' : 'EXECUTE ON-CHAIN TRANSFER'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
