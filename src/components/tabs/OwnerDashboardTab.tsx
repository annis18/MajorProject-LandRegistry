import React, { useState } from 'react';
import { useBlockchain } from '../../context/BlockchainContext';
import { shortenAddress } from '../../utils/crypto';
import {
  Building2,
  ArrowRightLeft,
  ShieldCheck,
  Lock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
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

  // Transfer form state
  const [selectedParcelId, setSelectedParcelId] = useState<string>(myProperties[0]?.parcelId || '');
  const [recipientAddress, setRecipientAddress] = useState<string>(accounts[4]?.address || '');
  const [customDeedURI, setCustomDeedURI] = useState<string>('');
  const [isTransferring, setIsTransferring] = useState(false);
  const [transferError, setTransferError] = useState<string | null>(null);

  // Target property object
  const activeParcel = properties.find(p => p.parcelId === selectedParcelId) || myProperties[0];

  // Smart Contract Security Checks
  const isVerified = activeParcel?.verified;
  const hasActiveLien = activeParcel?.encumbrances.some(e => e.active);
  const isCurrentOwner = activeParcel?.currentOwner.toLowerCase() === currentAccount.address.toLowerCase();
  const isValidRecipient =
    recipientAddress.startsWith('0x') &&
    recipientAddress.length === 42 &&
    recipientAddress.toLowerCase() !== activeParcel?.currentOwner.toLowerCase();
  const canTransfer = isVerified && !hasActiveLien && isCurrentOwner && isValidRecipient;

  // Load sample transfer to Kartikey
  const handleLoadSampleTransfer = () => {
    if (myProperties.length > 0) {
      setSelectedParcelId(myProperties[0].parcelId);
    }
    setRecipientAddress(accounts[4].address); // Kartikey
    setCustomDeedURI('ipfs://sale-deed-transfer-2026');
    setTransferError(null);
    onNotify('info', 'Sample Transfer Loaded', 'Filled transfer form with Buyer wallet (Kartikey).');
  };

  const handleTransferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTransferError(null);

    if (!selectedParcelId) {
      setTransferError('Please select a property to transfer.');
      return;
    }

    if (!recipientAddress.trim() || !recipientAddress.startsWith('0x')) {
      setTransferError('Please enter a valid wallet address (starting with 0x) for the buyer.');
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
      onNotify('success', 'Ownership Transferred', result.message, result.txHash);
      setCustomDeedURI('');
    } else {
      setTransferError(result.message);
      onNotify('error', 'Transfer Blocked', result.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Current User & Quick Switcher */}
      <div className="bg-white border border-[#e9ecef] rounded-xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#fff9db] text-[#f59f00] border border-[#ffec99]">
                CITIZEN / OWNER VIEW
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
              onClick={() => setCurrentAccount(accounts[3])} // Ayushhh
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                currentAccount.address === accounts[3].address
                  ? 'bg-[#1a1a1a] text-white border-[#1a1a1a] shadow-xs'
                  : 'bg-[#f8f9fa] text-[#495057] hover:text-[#1a1a1a] hover:bg-[#e9ecef] border-[#ced4da]'
              }`}
            >
              Ayushhh (Owner)
            </button>
            <button
              onClick={() => setCurrentAccount(accounts[4])} // Kartikey
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                currentAccount.address === accounts[4].address
                  ? 'bg-[#1a1a1a] text-white border-[#1a1a1a] shadow-xs'
                  : 'bg-[#f8f9fa] text-[#495057] hover:text-[#1a1a1a] hover:bg-[#e9ecef] border-[#ced4da]'
              }`}
            >
              Kartikey (Buyer)
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 1: My Owned Properties */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-[#1a1a1a] uppercase tracking-wider flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#0ca678]" />
            <span>My Owned Properties ({myProperties.length})</span>
          </h3>
          <span className="text-xs text-[#6c757d] font-medium">
            Verified on-chain via owner wallet address
          </span>
        </div>

        {myProperties.length === 0 ? (
          <div className="bg-white border border-dashed border-[#ced4da] p-8 rounded-xl text-center">
            <Building2 className="w-10 h-10 text-[#adb5bd] mx-auto mb-2" />
            <h4 className="text-sm font-bold text-[#1a1a1a]">No Properties Owned by This Wallet</h4>
            <p className="text-xs text-[#6c757d] mt-1 max-w-md mx-auto">
              Switch to "Ayushhh (Owner)" or "Kartikey (Buyer)" above, or register a new plot in the Authority Portal.
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
                          <Lock className="w-3.5 h-3.5" /> Locked (Active Bank Loan)
                        </span>
                      ) : prop.verified ? (
                        <span className="text-[11px] text-[#0ca678] font-bold flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" /> Ready for Transfer
                        </span>
                      ) : (
                        <span className="text-[11px] text-[#f59f00] font-bold flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> Waiting for Surveyor Verification
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
                      <span>Select to Sell / Transfer</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SECTION 2: Transfer Ownership Workflow */}
      <div className="bg-white border border-[#e9ecef] rounded-xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e9ecef] pb-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#0ca678] bg-[#e6fcf5] px-2 py-0.5 rounded border border-[#b2f2bb]">
                STEP 3
              </span>
              <h3 className="text-base font-bold text-[#1a1a1a] tracking-tight">
                Transfer Property Ownership (Sell to Buyer)
              </h3>
            </div>
            <p className="text-xs text-[#6c757d] mt-0.5 font-medium">
              Transfer a verified, loan-free property to a new buyer wallet on the blockchain.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLoadSampleTransfer}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#e6fcf5] hover:bg-[#b2f2bb] text-[#0ca678] border border-[#b2f2bb] text-xs font-bold transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>FILL SAMPLE TRANSFER</span>
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
                <option value="">-- Choose a property --</option>
                {properties.map(p => (
                  <option key={p.parcelId} value={p.parcelId}>
                    {p.parcelId} — {p.propertyNumber} (Owner: {p.currentOwnerName})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#495057] mb-1">
                Buyer Wallet Address <span className="text-[#e03131]">*</span>
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
                  Set Kartikey (Buyer)
                </button>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#495057] mb-1">
                New Sale Deed Document Link (IPFS)
              </label>
              <input
                type="text"
                placeholder="ipfs://sale-deed-2026..."
                value={customDeedURI}
                onChange={e => setCustomDeedURI(e.target.value)}
                className="w-full bg-[#f8f9fa] border border-[#ced4da] rounded-lg px-3.5 py-2 text-xs text-[#1a1a1a] focus:bg-white focus:outline-none focus:border-[#1a1a1a] font-mono"
              />
            </div>
          </div>

          {/* Smart Contract Security Checks */}
          <div className="p-4 bg-[#f8f9fa] rounded-xl border border-[#e9ecef]">
            <h4 className="text-xs font-bold text-[#6c757d] uppercase tracking-wider mb-3">
              Smart Contract Security Checks (Before Transfer)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2">
                {isCurrentOwner ? (
                  <CheckCircle2 className="w-4 h-4 text-[#0ca678] shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-[#e03131] shrink-0" />
                )}
                <span className={isCurrentOwner ? 'text-[#495057] font-medium' : 'text-[#e03131] font-bold'}>
                  1. Current user is the owner ({isCurrentOwner ? 'PASS' : 'FAIL: Not the owner'})
                </span>
              </div>

              <div className="flex items-center gap-2">
                {isVerified ? (
                  <CheckCircle2 className="w-4 h-4 text-[#0ca678] shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-[#f59f00] shrink-0" />
                )}
                <span className={isVerified ? 'text-[#495057] font-medium' : 'text-[#f59f00] font-bold'}>
                  2. Property is verified by Surveyor ({isVerified ? 'PASS' : 'FAIL: Not verified yet'})
                </span>
              </div>

              <div className="flex items-center gap-2">
                {!hasActiveLien ? (
                  <CheckCircle2 className="w-4 h-4 text-[#0ca678] shrink-0" />
                ) : (
                  <Lock className="w-4 h-4 text-[#e03131] shrink-0" />
                )}
                <span className={!hasActiveLien ? 'text-[#495057] font-medium' : 'text-[#e03131] font-bold'}>
                  3. No active bank loan or lock ({!hasActiveLien ? 'PASS' : 'FAIL: Active loan lock'})
                </span>
              </div>

              <div className="flex items-center gap-2">
                {isValidRecipient ? (
                  <CheckCircle2 className="w-4 h-4 text-[#0ca678] shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-[#e03131] shrink-0" />
                )}
                <span className={isValidRecipient ? 'text-[#495057] font-medium' : 'text-[#e03131] font-bold'}>
                  4. Valid buyer wallet address ({isValidRecipient ? 'PASS' : 'FAIL: Invalid or same wallet'})
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="text-xs text-[#6c757d]">
              {canTransfer ? (
                <span className="text-[#0ca678] font-bold">✓ All security checks passed. Ready to transfer ownership.</span>
              ) : (
                <span className="text-[#e03131] font-medium">✗ Please fix the failed check(s) above before transferring.</span>
              )}
            </div>

            <button
              type="submit"
              disabled={isTransferring}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#1a1a1a] hover:bg-[#2d3436] text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50"
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>{isTransferring ? 'Transferring...' : 'TRANSFER OWNERSHIP ON BLOCKCHAIN'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};