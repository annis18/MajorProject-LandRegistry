import React, { useState } from 'react';
import { useBlockchain } from '../../context/BlockchainContext';
import { PropertyType, EncumbranceKind } from '../../types';
import { shortenAddress, generateSha256 } from '../../utils/crypto';
import {
  ShieldCheck,
  PlusCircle,
  CheckCircle2,
  Lock,
  Unlock,
  AlertCircle,
  Users,
  RotateCcw,
} from 'lucide-react';

interface AuthorityDashboardProps {
  onNotify: (type: 'success' | 'error' | 'info', title: string, message: string, txHash?: string) => void;
}

export const AuthorityDashboardTab: React.FC<AuthorityDashboardProps> = ({ onNotify }) => {
  const {
    properties,
    currentAccount,
    registerProperty,
    verifyProperty,
    addEncumbrance,
    releaseEncumbrance,
    accounts,
  } = useBlockchain();

  // Registration Form State
  const [regForm, setRegForm] = useState({
    parcelId: '',
    propertyNumber: '',
    surveyNumber: '',
    location: '',
    state: 'Uttar Pradesh',
    district: 'Kanpur Nagar',
    areaSqFt: 3500,
    propertyType: 'RESIDENTIAL' as PropertyType,
    geoHash: 'tu4q9z12',
    metadataURI: 'ipfs://bafybeidemo' + Date.now(),
    documentHash: '',
    initialOwnerAddress: accounts[3]?.address || '',
    deedURI: 'ipfs://initial-deed-official',
    marketValueEth: 18.0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Encumbrance Form State
  const [encForm, setEncForm] = useState({
    parcelId: properties[0]?.parcelId || '',
    kind: 'MORTGAGE' as EncumbranceKind,
    ref: 'HOME-LOAN-REF-4042',
    details: 'Active Bank Home Loan of ₹45 Lakhs on this plot',
  });

  // Load UP-based sample presets into registration form
  const handleLoadSpecificPreset = (type: 'kanpur' | 'noida' | 'rooma' | 'lucknow') => {
    if (type === 'kanpur') {
      setRegForm({
        parcelId: 'PROP-UP-KAN-005',
        propertyNumber: 'Plot 78B, Swaroop Nagar',
        surveyNumber: 'Survey-982/2026',
        location: 'Swaroop Nagar, Kanpur, Uttar Pradesh',
        state: 'Uttar Pradesh',
        district: 'Kanpur Nagar',
        areaSqFt: 3200,
        propertyType: 'RESIDENTIAL',
        geoHash: 'tu4q9z55',
        metadataURI: 'ipfs://bafybeidemo-swaroopnagar-kanpur',
        documentHash: '9e2d9b62a4f65c1928374d82f1b0a3c749210e39b4d7f8c12a647d9283f4e190',
        initialOwnerAddress: accounts[3]?.address || '0x90F79bf6EB2c4f870365E785982E1f101E93b906', // Ayushhh
        deedURI: 'ipfs://initial-deed-kanpur-official',
        marketValueEth: 22.5,
      });
      onNotify('info', 'Preset Loaded: Kanpur Residential Plot', 'Filled form with Swaroop Nagar plot for Ayushhh.');
    } else if (type === 'noida') {
      setRegForm({
        parcelId: 'PROP-UP-NOI-008',
        propertyNumber: 'Tower C, Sector 62 IT Park',
        surveyNumber: 'Survey-44/1A',
        location: 'Sector 62, Noida, Uttar Pradesh',
        state: 'Uttar Pradesh',
        district: 'Gautam Buddha Nagar',
        areaSqFt: 12500,
        propertyType: 'COMMERCIAL',
        geoHash: 'ttpg4c99',
        metadataURI: 'ipfs://bafybeidemo-techpark-noida',
        documentHash: '3a1f8b90c1e842367d5e4b99810a9c77610e2410a8b9c1d044ef1a01c45d3e89',
        initialOwnerAddress: accounts[4]?.address || '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65', // Kartikey
        deedURI: 'ipfs://initial-deed-noida-official',
        marketValueEth: 65.0,
      });
      onNotify('info', 'Preset Loaded: Noida Sector 62 Commercial', 'Filled form with Noida IT Park plot for Kartikey.');
    } else if (type === 'rooma') {
      setRegForm({
        parcelId: 'PROP-UP-KAN-012',
        propertyNumber: 'Khasra No. 142, Rooma Highway',
        surveyNumber: 'Khasra-142/2',
        location: 'Rooma, Kanpur Nagar, Uttar Pradesh',
        state: 'Uttar Pradesh',
        district: 'Kanpur Nagar',
        areaSqFt: 25000,
        propertyType: 'AGRICULTURAL',
        geoHash: 'tu4q8x22',
        metadataURI: 'ipfs://bafybeidemo-rooma-farmland',
        documentHash: 'b5c2d89f01e74928374d82f1b0a3c749210e39b4d7f8c12a647d9283f4e190a1',
        initialOwnerAddress: accounts[3]?.address || '0x90F79bf6EB2c4f870365E785982E1f101E93b906', // Ayushhh
        deedURI: 'ipfs://initial-deed-rooma-official',
        marketValueEth: 14.0,
      });
      onNotify('info', 'Preset Loaded: Kanpur Farmland', 'Filled form with agricultural plot in Rooma.');
    } else {
      setRegForm({
        parcelId: 'PROP-UP-LKO-019',
        propertyNumber: 'Plot 12, Amausi Industrial Area',
        surveyNumber: 'IND-409/B',
        location: 'Amausi Industrial Area, Lucknow',
        state: 'Uttar Pradesh',
        district: 'Lucknow',
        areaSqFt: 18000,
        propertyType: 'INDUSTRIAL',
        geoHash: 'tu69y711',
        metadataURI: 'ipfs://bafybeidemo-lucknow-industrial',
        documentHash: '6f8a02c91b3e45d67890abcdef1234567890abcdef1234567890abcdef123456',
        initialOwnerAddress: accounts[4]?.address || '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65', // Kartikey
        deedURI: 'ipfs://initial-deed-lucknow-official',
        marketValueEth: 40.0,
      });
      onNotify('info', 'Preset Loaded: Lucknow Industrial Plot', 'Filled form with industrial warehouse plot in Lucknow.');
    }
    setFormError(null);
  };

  const handleClear = () => {
    setRegForm({
      parcelId: '',
      propertyNumber: '',
      surveyNumber: '',
      location: '',
      state: 'Uttar Pradesh',
      district: 'Kanpur Nagar',
      areaSqFt: 0,
      propertyType: 'RESIDENTIAL',
      geoHash: '',
      metadataURI: '',
      documentHash: '',
      initialOwnerAddress: '',
      deedURI: '',
      marketValueEth: 0,
    });
    setFormError(null);
  };

  // Auto-generate SHA-256 hash if empty
  const handleGenerateHash = async () => {
    if (!regForm.parcelId || !regForm.propertyNumber) {
      setFormError('Please enter Property ID and Plot Number first.');
      return;
    }
    const sampleDeedContent = JSON.stringify({
      parcelId: regForm.parcelId,
      propertyNumber: regForm.propertyNumber,
      surveyNumber: regForm.surveyNumber,
      location: regForm.location,
      owner: regForm.initialOwnerAddress,
      timestamp: Date.now(),
    });
    const hash = await generateSha256(sampleDeedContent);
    setRegForm(prev => ({ ...prev, documentHash: hash }));
    setFormError(null);
  };

  // Submit property registration
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!regForm.parcelId.trim()) {
      setFormError('Please enter a valid unique Property ID (e.g. PROP-UP-KAN-005).');
      return;
    }

    if (!regForm.propertyNumber.trim()) {
      setFormError('Please enter the Plot / House Number.');
      return;
    }

    if (!regForm.initialOwnerAddress.trim() || !regForm.initialOwnerAddress.startsWith('0x')) {
      setFormError('Please enter a valid wallet address (starting with 0x) for the Owner.');
      return;
    }

    if (Number(regForm.areaSqFt) <= 0) {
      setFormError('Property Area must be greater than 0.');
      return;
    }

    let finalDocHash = regForm.documentHash;
    if (!finalDocHash) {
      const sampleDeedContent = JSON.stringify({
        parcelId: regForm.parcelId,
        propertyNumber: regForm.propertyNumber,
        surveyNumber: regForm.surveyNumber,
        location: regForm.location,
        timestamp: Date.now(),
      });
      finalDocHash = await generateSha256(sampleDeedContent);
    }

    setIsSubmitting(true);
    const result = await registerProperty({
      ...regForm,
      documentHash: finalDocHash,
    });
    setIsSubmitting(false);

    if (result.success) {
      onNotify('success', 'Property Registered On-Chain', result.message, result.txHash);
      handleClear();
    } else {
      setFormError(result.message);
      onNotify('error', 'Registration Failed', result.message);
    }
  };

  // Handle Verification
  const handleVerify = async (parcelId: string) => {
    const result = await verifyProperty(parcelId);
    if (result.success) {
      onNotify('success', 'Property Verified', result.message, result.txHash);
    } else {
      onNotify('error', 'Verification Failed', result.message);
    }
  };

  // Handle Add Encumbrance
  const handleAddEncumbrance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!encForm.parcelId) {
      onNotify('error', 'Validation Error', 'Please select a property.');
      return;
    }
    const result = await addEncumbrance({
      parcelId: encForm.parcelId,
      kind: encForm.kind,
      ref: encForm.ref,
      details: encForm.details,
    });

    if (result.success) {
      onNotify('success', 'Loan / Lock Recorded', result.message, result.txHash);
    } else {
      onNotify('error', 'Action Failed', result.message);
    }
  };

  // Handle Release Encumbrance
  const handleReleaseEnc = async (parcelId: string, encId: string) => {
    const result = await releaseEncumbrance(parcelId, encId);
    if (result.success) {
      onNotify('success', 'Loan Lock Released', result.message, result.txHash);
    } else {
      onNotify('error', 'Release Failed', result.message);
    }
  };

  const isRegistrarOrAdmin = currentAccount.role === 'REGISTRAR' || currentAccount.role === 'ADMIN';
  const isSurveyorOrAdmin = currentAccount.role === 'SURVEYOR' || currentAccount.role === 'REGISTRAR' || currentAccount.role === 'ADMIN';
  const isNotaryOrAdmin = currentAccount.role === 'NOTARY' || currentAccount.role === 'ADMIN';

  const unverifiedParcels = properties.filter(p => !p.verified);
  const encumberedParcels = properties.filter(p => p.encumbrances.some(e => e.active));

  return (
    <div className="space-y-6">
      {/* Role Authorization Alert Banner */}
      <div
        className={`p-4 rounded-xl border flex items-start gap-3 shadow-xs ${
          isRegistrarOrAdmin || isSurveyorOrAdmin || isNotaryOrAdmin
            ? 'bg-white border-[#e9ecef] text-[#1a1a1a]'
            : 'bg-[#fff5f5] border-[#ffc9c9] text-[#e03131]'
        }`}
      >
        <ShieldCheck className={`w-5 h-5 mt-0.5 shrink-0 ${isRegistrarOrAdmin ? 'text-[#0ca678]' : 'text-[#f59f00]'}`} />
        <div>
          <h3 className="text-sm font-bold text-[#1a1a1a]">
            Active User: {currentAccount.name} ({currentAccount.roleLabel})
          </h3>
          <p className="text-xs text-[#6c757d] mt-0.5">
            Wallet:{' '}
            <span className="font-mono text-[#1a1a1a] font-semibold">{currentAccount.address}</span>
          </p>
          {!isRegistrarOrAdmin && (
            <p className="text-xs text-[#f59f00] mt-1 font-semibold">
              Note: Only the Registrar (Animesh) can register new properties. If you try with this account, the smart contract will reject it with{' '}
              <code className="bg-[#fff9db] px-1.5 py-0.5 rounded text-[#e03131] font-mono border border-[#ffec99]">
                "Not authorized registrar"
              </code>.
            </p>
          )}
        </div>
      </div>

      {/* SECTION A: Register Property */}
      <div className="bg-white border border-[#e9ecef] rounded-xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e9ecef] pb-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#0ca678] bg-[#e6fcf5] px-2 py-0.5 rounded border border-[#b2f2bb]">
                STEP 1
              </span>
              <h2 className="text-base font-bold text-[#1a1a1a] tracking-tight">Register New Property Plot</h2>
            </div>
            <p className="text-xs text-[#6c757d] mt-0.5 font-medium">
              Add a new land plot with its location, area, owner wallet, and document hash to the blockchain.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold text-[#6c757d] mr-1">Sample UP Plots:</span>
            <button
              type="button"
              onClick={() => handleLoadSpecificPreset('kanpur')}
              className="px-2.5 py-1 rounded-md bg-[#f8f9fa] hover:bg-[#e9ecef] text-[#1a1a1a] border border-[#ced4da] text-[11px] font-bold transition-colors"
            >
              🏡 Kanpur Plot
            </button>
            <button
              type="button"
              onClick={() => handleLoadSpecificPreset('noida')}
              className="px-2.5 py-1 rounded-md bg-[#f8f9fa] hover:bg-[#e9ecef] text-[#1a1a1a] border border-[#ced4da] text-[11px] font-bold transition-colors"
            >
              🏢 Noida Sec-62
            </button>
            <button
              type="button"
              onClick={() => handleLoadSpecificPreset('rooma')}
              className="px-2.5 py-1 rounded-md bg-[#f8f9fa] hover:bg-[#e9ecef] text-[#1a1a1a] border border-[#ced4da] text-[11px] font-bold transition-colors"
            >
              🌾 Rooma Farm
            </button>
            <button
              type="button"
              onClick={() => handleLoadSpecificPreset('lucknow')}
              className="px-2.5 py-1 rounded-md bg-[#f8f9fa] hover:bg-[#e9ecef] text-[#1a1a1a] border border-[#ced4da] text-[11px] font-bold transition-colors"
            >
              🏭 Lucknow Hub
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-white hover:bg-[#f8f9fa] text-[#6c757d] border border-[#ced4da] text-[11px] font-bold transition-colors"
              title="Clear all fields"
            >
              <RotateCcw className="w-3 h-3 text-[#adb5bd]" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {formError && (
          <div className="mb-5 p-3 rounded-xl bg-[#fff5f5] border border-[#ffc9c9] text-[#e03131] text-xs flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 text-[#e03131] shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#495057] mb-1">
                Unique Property ID <span className="text-[#e03131]">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. PROP-UP-KAN-005"
                value={regForm.parcelId}
                onChange={e => setRegForm({ ...regForm, parcelId: e.target.value })}
                className="w-full bg-[#f8f9fa] border border-[#ced4da] rounded-lg px-3.5 py-2 text-xs text-[#1a1a1a] focus:bg-white focus:outline-none focus:border-[#1a1a1a] font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#495057] mb-1">
                Plot / House Number <span className="text-[#e03131]">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Plot-78B"
                value={regForm.propertyNumber}
                onChange={e => setRegForm({ ...regForm, propertyNumber: e.target.value })}
                className="w-full bg-[#f8f9fa] border border-[#ced4da] rounded-lg px-3.5 py-2 text-xs text-[#1a1a1a] focus:bg-white focus:outline-none focus:border-[#1a1a1a]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#495057] mb-1">
                Survey / Khasra Number <span className="text-[#e03131]">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Survey 84, Block B"
                value={regForm.surveyNumber}
                onChange={e => setRegForm({ ...regForm, surveyNumber: e.target.value })}
                className="w-full bg-[#f8f9fa] border border-[#ced4da] rounded-lg px-3.5 py-2 text-xs text-[#1a1a1a] focus:bg-white focus:outline-none focus:border-[#1a1a1a]"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#495057] mb-1">
                Location / Address <span className="text-[#e03131]">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Swaroop Nagar, Kanpur, Uttar Pradesh"
                value={regForm.location}
                onChange={e => setRegForm({ ...regForm, location: e.target.value })}
                className="w-full bg-[#f8f9fa] border border-[#ced4da] rounded-lg px-3.5 py-2 text-xs text-[#1a1a1a] focus:bg-white focus:outline-none focus:border-[#1a1a1a]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#495057] mb-1">
                Property Type <span className="text-[#e03131]">*</span>
              </label>
              <select
                value={regForm.propertyType}
                onChange={e => setRegForm({ ...regForm, propertyType: e.target.value as PropertyType })}
                className="w-full bg-[#f8f9fa] border border-[#ced4da] rounded-lg px-3.5 py-2 text-xs text-[#1a1a1a] focus:bg-white focus:outline-none focus:border-[#1a1a1a] cursor-pointer"
              >
                <option value="RESIDENTIAL">RESIDENTIAL</option>
                <option value="COMMERCIAL">COMMERCIAL</option>
                <option value="AGRICULTURAL">AGRICULTURAL</option>
                <option value="INDUSTRIAL">INDUSTRIAL</option>
                <option value="GOVERNMENT">GOVERNMENT</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#495057] mb-1">
                Area in Sq. Feet <span className="text-[#e03131]">*</span>
              </label>
              <input
                type="number"
                placeholder="e.g. 3200"
                value={regForm.areaSqFt || ''}
                onChange={e => setRegForm({ ...regForm, areaSqFt: Number(e.target.value) })}
                className="w-full bg-[#f8f9fa] border border-[#ced4da] rounded-lg px-3.5 py-2 text-xs text-[#1a1a1a] focus:bg-white focus:outline-none focus:border-[#1a1a1a]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#495057] mb-1">
                Map Grid Code (Geohash)
              </label>
              <input
                type="text"
                placeholder="e.g. tu4q9z12"
                value={regForm.geoHash}
                onChange={e => setRegForm({ ...regForm, geoHash: e.target.value })}
                className="w-full bg-[#f8f9fa] border border-[#ced4da] rounded-lg px-3.5 py-2 text-xs text-[#1a1a1a] focus:bg-white focus:outline-none focus:border-[#1a1a1a] font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#495057] mb-1">
                Owner Wallet Address <span className="text-[#e03131]">*</span>
              </label>
              <input
                type="text"
                placeholder="0x..."
                value={regForm.initialOwnerAddress}
                onChange={e => setRegForm({ ...regForm, initialOwnerAddress: e.target.value })}
                className="w-full bg-[#f8f9fa] border border-[#ced4da] rounded-lg px-3.5 py-2 text-xs text-[#1a1a1a] focus:bg-white focus:outline-none focus:border-[#1a1a1a] font-mono"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-[#495057]">
                  Document SHA-256 Hash (Digital Fingerprint) <span className="text-[#e03131]">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleGenerateHash}
                  className="text-[11px] text-[#1971c2] hover:underline font-bold"
                >
                  Auto-Generate Hash
                </button>
              </div>
              <input
                type="text"
                placeholder="0x..."
                value={regForm.documentHash}
                onChange={e => setRegForm({ ...regForm, documentHash: e.target.value })}
                className="w-full bg-[#f8f9fa] border border-[#ced4da] rounded-lg px-3.5 py-2 text-xs text-[#1a1a1a] focus:bg-white focus:outline-none focus:border-[#1a1a1a] font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#495057] mb-1">
                Off-Chain Document Link (IPFS)
              </label>
              <input
                type="text"
                placeholder="ipfs://bafybeidemo..."
                value={regForm.deedURI}
                onChange={e => setRegForm({ ...regForm, deedURI: e.target.value })}
                className="w-full bg-[#f8f9fa] border border-[#ced4da] rounded-lg px-3.5 py-2 text-xs text-[#1a1a1a] focus:bg-white focus:outline-none focus:border-[#1a1a1a] font-mono"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#1a1a1a] hover:bg-[#2d3436] text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving to Blockchain...' : 'REGISTER PROPERTY ON BLOCKCHAIN'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* SECTION B: Pending Surveyor Verification Queue */}
      <div className="bg-white border border-[#e9ecef] rounded-xl p-6 shadow-xs">
        <div className="border-b border-[#e9ecef] pb-4 mb-5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-[#1971c2] bg-[#e7f5ff] px-2 py-0.5 rounded border border-[#a5d8ff]">
              STEP 2
            </span>
            <h2 className="text-base font-bold text-[#1a1a1a] tracking-tight">
              Pending Surveyor Verification ({unverifiedParcels.length})
            </h2>
          </div>
          <p className="text-xs text-[#6c757d] mt-0.5 font-medium">
            The Land Surveyor (Harsh) or Registrar (Animesh) verifies physical boundaries before a property can be sold.
          </p>
        </div>

        {unverifiedParcels.length === 0 ? (
          <div className="p-6 rounded-xl bg-[#f8f9fa] text-center border border-[#e9ecef]">
            <CheckCircle2 className="w-8 h-8 text-[#0ca678] mx-auto mb-2" />
            <p className="text-sm font-bold text-[#1a1a1a]">All Registered Properties Are Verified</p>
            <p className="text-xs text-[#6c757d] mt-0.5 font-medium">No pending properties waiting for inspection.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {unverifiedParcels.map(prop => (
              <div
                key={prop.parcelId}
                className="p-4 rounded-xl bg-[#f8f9fa] border border-[#e9ecef] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#f59f00] bg-[#fff9db] px-2 py-0.5 rounded border border-[#ffec99]">{prop.parcelId}</span>
                    <span className="text-xs font-bold text-[#1a1a1a]">{prop.propertyNumber}</span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#f1f3f5] text-[#495057] border border-[#ced4da]">
                      {prop.propertyType}
                    </span>
                  </div>
                  <p className="text-xs text-[#6c757d] mt-1 font-medium">{prop.location} ({prop.surveyNumber})</p>
                  <p className="text-[11px] text-[#adb5bd] font-mono mt-0.5">Owner: {prop.currentOwnerName} ({shortenAddress(prop.currentOwner)})</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleVerify(prop.parcelId)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1971c2] hover:bg-[#1864ab] text-white text-xs font-bold transition-colors shadow-xs"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>APPROVE & VERIFY</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION C: Bank Loans & Legal Locks */}
      <div className="bg-white border border-[#e9ecef] rounded-xl p-6 shadow-xs">
        <div className="border-b border-[#e9ecef] pb-4 mb-5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-[#ae3ec9] bg-[#f3d9fa] px-2 py-0.5 rounded border border-[#eebefa]">
              BANK & LEGAL OFFICER
            </span>
            <h2 className="text-base font-bold text-[#1a1a1a] tracking-tight">
              Bank Loans & Legal Locks (Encumbrances)
            </h2>
          </div>
          <p className="text-xs text-[#6c757d] mt-0.5 font-medium">
            The Bank / Legal Officer (Divyanshh) can attach an active loan or dispute lock. Locked properties cannot be transferred until cleared.
          </p>
        </div>

        {/* Place Encumbrance Form */}
        <form onSubmit={handleAddEncumbrance} className="p-4 bg-[#f8f9fa] rounded-xl border border-[#e9ecef] mb-6">
          <h4 className="text-xs font-bold text-[#1a1a1a] uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-[#e03131]" />
            <span>Attach Bank Loan or Legal Lock</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#495057] mb-1">Select Property</label>
              <select
                value={encForm.parcelId}
                onChange={e => setEncForm({ ...encForm, parcelId: e.target.value })}
                className="w-full bg-white border border-[#ced4da] rounded-lg px-3 py-2 text-xs text-[#1a1a1a] focus:outline-none focus:border-[#1a1a1a]"
              >
                {properties.map(p => (
                  <option key={p.parcelId} value={p.parcelId}>
                    {p.parcelId} — {p.propertyNumber}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#495057] mb-1">Lock Reason / Type</label>
              <select
                value={encForm.kind}
                onChange={e => setEncForm({ ...encForm, kind: e.target.value as EncumbranceKind })}
                className="w-full bg-white border border-[#ced4da] rounded-lg px-3 py-2 text-xs text-[#1a1a1a] focus:outline-none focus:border-[#1a1a1a]"
              >
                <option value="MORTGAGE">MORTGAGE (Active Home Loan)</option>
                <option value="COURT_ORDER">COURT_ORDER (Legal Dispute Stay)</option>
                <option value="TAX_LIEN">TAX_LIEN (Pending Property Tax)</option>
                <option value="BANK_LIEN">BANK_LIEN (Business Loan Guarantee)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#495057] mb-1">Reference Number</label>
              <input
                type="text"
                value={encForm.ref}
                onChange={e => setEncForm({ ...encForm, ref: e.target.value })}
                className="w-full bg-white border border-[#ced4da] rounded-lg px-3 py-2 text-xs text-[#1a1a1a] focus:outline-none focus:border-[#1a1a1a]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#495057] mb-1">Loan / Lock Details</label>
              <input
                type="text"
                value={encForm.details}
                onChange={e => setEncForm({ ...encForm, details: e.target.value })}
                className="w-full bg-white border border-[#ced4da] rounded-lg px-3 py-2 text-xs text-[#1a1a1a] focus:outline-none focus:border-[#1a1a1a]"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2 px-4 rounded-lg bg-[#1a1a1a] hover:bg-[#2d3436] text-white text-xs font-bold transition-colors shadow-xs"
              >
                LOCK PROPERTY ON-CHAIN
              </button>
            </div>
          </div>
        </form>

        {/* Active Encumbrances List */}
        <div>
          <h4 className="text-xs font-bold text-[#6c757d] uppercase tracking-wider mb-3">
            Currently Locked Properties ({encumberedParcels.length})
          </h4>

          {encumberedParcels.length === 0 ? (
            <div className="p-4 rounded-xl bg-[#f8f9fa] text-xs text-[#6c757d] text-center border border-[#e9ecef] font-medium">
              No active bank loans or locks on any property.
            </div>
          ) : (
            <div className="space-y-2">
              {encumberedParcels.map(prop => (
                <div key={prop.parcelId} className="p-3.5 rounded-xl bg-[#f8f9fa] border border-[#e9ecef] text-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-[#1a1a1a]">
                      {prop.parcelId} — {prop.propertyNumber}
                    </span>
                    <span className="text-[11px] font-mono text-[#e03131] font-semibold">Owner: {prop.currentOwnerName}</span>
                  </div>

                  {prop.encumbrances.filter(e => e.active).map(enc => (
                    <div
                      key={enc.id}
                      className="p-2.5 rounded-lg bg-[#fff5f5] border border-[#ffc9c9] flex items-center justify-between gap-3 text-[11px]"
                    >
                      <div>
                        <span className="font-bold text-[#e03131]">{enc.kind}</span> ({enc.ref}): {enc.details}
                      </div>

                      <button
                        onClick={() => handleReleaseEnc(prop.parcelId, enc.id)}
                        className="flex items-center gap-1 px-3 py-1 rounded bg-[#e6fcf5] hover:bg-[#b2f2bb] text-[#0ca678] border border-[#b2f2bb] font-bold transition-colors shrink-0"
                      >
                        <Unlock className="w-3 h-3" />
                        <span>CLEAR LOAN & UNLOCK</span>
                      </button>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* SECTION D: Role Permissions Table */}
      <div className="bg-white border border-[#e9ecef] rounded-xl p-6 shadow-xs">
        <h3 className="text-sm font-bold text-[#1a1a1a] uppercase tracking-wider mb-4 flex items-center gap-2">
          <Users className="w-4 h-4 text-[#0ca678]" />
          <span>Team Role Permissions (Who Can Do What)</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#e9ecef] text-[#6c757d] bg-[#f8f9fa]">
                <th className="py-2.5 px-3 font-bold">Role & Team Member</th>
                <th className="py-2.5 px-3 font-bold">Register Plot</th>
                <th className="py-2.5 px-3 font-bold">Verify Plot</th>
                <th className="py-2.5 px-3 font-bold">Lock / Unlock Loan</th>
                <th className="py-2.5 px-3 font-bold">Transfer Ownership</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e9ecef] font-mono text-[11px]">
              <tr>
                <td className="py-2.5 px-3 font-bold text-[#0ca678]">REGISTRAR (Animesh)</td>
                <td className="py-2.5 px-3 text-[#0ca678] font-bold">✓ YES</td>
                <td className="py-2.5 px-3 text-[#0ca678] font-bold">✓ YES</td>
                <td className="py-2.5 px-3 text-[#0ca678] font-bold">✓ YES</td>
                <td className="py-2.5 px-3 text-[#adb5bd]">✗ No (Only Owner)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-[#1971c2]">SURVEYOR (Harsh)</td>
                <td className="py-2.5 px-3 text-[#adb5bd]">✗ No</td>
                <td className="py-2.5 px-3 text-[#1971c2] font-bold">✓ YES</td>
                <td className="py-2.5 px-3 text-[#adb5bd]">✗ No</td>
                <td className="py-2.5 px-3 text-[#adb5bd]">✗ No</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-[#ae3ec9]">BANK OFFICER (Divyanshh)</td>
                <td className="py-2.5 px-3 text-[#adb5bd]">✗ No</td>
                <td className="py-2.5 px-3 text-[#adb5bd]">✗ No</td>
                <td className="py-2.5 px-3 text-[#ae3ec9] font-bold">✓ YES</td>
                <td className="py-2.5 px-3 text-[#ae3ec9] font-bold">✓ YES (Legal Sign-off)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-[#f59f00]">OWNER / CITIZEN (Ayushhh & Kartikey)</td>
                <td className="py-2.5 px-3 text-[#adb5bd]">✗ No</td>
                <td className="py-2.5 px-3 text-[#adb5bd]">✗ No</td>
                <td className="py-2.5 px-3 text-[#adb5bd]">✗ No</td>
                <td className="py-2.5 px-3 text-[#f59f00] font-bold">✓ YES (Own plots only)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-[#e03131]">UNKNOWN WALLET</td>
                <td className="py-2.5 px-3 text-[#e03131] font-bold">✗ BLOCKED</td>
                <td className="py-2.5 px-3 text-[#e03131] font-bold">✗ BLOCKED</td>
                <td className="py-2.5 px-3 text-[#e03131] font-bold">✗ BLOCKED</td>
                <td className="py-2.5 px-3 text-[#e03131] font-bold">✗ BLOCKED</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};