import React, { useState } from 'react';
import { useBlockchain } from '../../context/BlockchainContext';
import { PropertyType, EncumbranceKind } from '../../types';
import { shortenAddress, generateSha256 } from '../../utils/crypto';
import {
  ShieldCheck,
  Building,
  PlusCircle,
  CheckCircle2,
  Lock,
  Unlock,
  AlertCircle,
  FileCheck2,
  Users,
  Sparkles,
  RotateCcw,
  Clock,
  ArrowRight,
  Landmark,
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
    loadSamplePropertyData,
    accounts,
  } = useBlockchain();

  // Registration Form State
  const [regForm, setRegForm] = useState({
    parcelId: '',
    propertyNumber: '',
    surveyNumber: '',
    location: '',
    state: 'Maharashtra',
    district: 'Pune',
    areaSqFt: 3500,
    propertyType: 'RESIDENTIAL' as PropertyType,
    geoHash: 'tek3v28uq1',
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
    ref: 'BANK-LOAN-SANCTION-REF-4042',
    details: 'Mortgage loan of ₹1.2 Cr granted for property development',
  });

  // Load specific sample presets into registration form
  const handleLoadSpecificPreset = (type: 'pune' | 'bengaluru' | 'nashik' | 'thane') => {
    if (type === 'pune') {
      setRegForm({
        parcelId: 'PROP-MH-PUN-005',
        propertyNumber: 'Plot 78B, Koregaon Park North',
        surveyNumber: 'CTS-982/2024',
        location: 'Koregaon Park, Pune, Maharashtra',
        state: 'Maharashtra',
        district: 'Pune',
        areaSqFt: 4200,
        propertyType: 'RESIDENTIAL',
        geoHash: 'tek3vc49p1',
        metadataURI: 'ipfs://bafybeidemo-koregaon-pune',
        documentHash: '9e2d9b62a4f65c1928374d82f1b0a3c749210e39b4d7f8c12a647d9283f4e190',
        initialOwnerAddress: accounts[3]?.address || '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
        deedURI: 'ipfs://initial-deed-koregaon-official',
        marketValueEth: 24.5,
      });
      onNotify('info', 'Preset Loaded: Pune Residential Villa', 'Populated form with Koregaon Park luxury residential parcel.');
    } else if (type === 'bengaluru') {
      setRegForm({
        parcelId: 'PROP-KA-BLR-008',
        propertyNumber: 'Tower B, Outer Ring Road Tech Zone',
        surveyNumber: 'SY-44/1A',
        location: 'Marathahalli-Sarjapur ORR, Bengaluru',
        state: 'Karnataka',
        district: 'Bengaluru Urban',
        areaSqFt: 18500,
        propertyType: 'COMMERCIAL',
        geoHash: 'tdr1vg89x2',
        metadataURI: 'ipfs://bafybeidemo-techpark-blr',
        documentHash: '3a1f8b90c1e842367d5e4b99810a9c77610e2410a8b9c1d044ef1a01c45d3e89',
        initialOwnerAddress: accounts[4]?.address || '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
        deedURI: 'ipfs://initial-deed-techpark-official',
        marketValueEth: 120.0,
      });
      onNotify('info', 'Preset Loaded: Bengaluru Tech Park', 'Populated form with commercial IT park parcel.');
    } else if (type === 'nashik') {
      setRegForm({
        parcelId: 'PROP-MH-NSK-012',
        propertyNumber: 'Gat No. 142/2, Dindori Vineyard',
        surveyNumber: 'GAT-142/2',
        location: 'Dindori Taluka, Nashik',
        state: 'Maharashtra',
        district: 'Nashik',
        areaSqFt: 87120,
        propertyType: 'AGRICULTURAL',
        geoHash: 'teq4va11y3',
        metadataURI: 'ipfs://bafybeidemo-vineyard-nashik',
        documentHash: 'b5c2d89f01e74928374d82f1b0a3c749210e39b4d7f8c12a647d9283f4e190a1',
        initialOwnerAddress: accounts[3]?.address || '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
        deedURI: 'ipfs://initial-deed-vineyard-official',
        marketValueEth: 14.0,
      });
      onNotify('info', 'Preset Loaded: Nashik Farmland', 'Populated form with 2-acre agricultural vineyard parcel.');
    } else {
      setRegForm({
        parcelId: 'PROP-MH-THN-019',
        propertyNumber: 'Shed 12, MIDC Logistics Hub',
        surveyNumber: 'MIDC-IND-409/B',
        location: 'Bhiwandi-Thane Logistics Corridor',
        state: 'Maharashtra',
        district: 'Thane',
        areaSqFt: 32000,
        propertyType: 'INDUSTRIAL',
        geoHash: 'te7ufq10a9',
        metadataURI: 'ipfs://bafybeidemo-midc-thane',
        documentHash: '6f8a02c91b3e45d67890abcdef1234567890abcdef1234567890abcdef123456',
        initialOwnerAddress: accounts[4]?.address || '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
        deedURI: 'ipfs://initial-deed-midc-official',
        marketValueEth: 65.0,
      });
      onNotify('info', 'Preset Loaded: Thane Industrial Hub', 'Populated form with industrial warehouse parcel.');
    }
    setFormError(null);
  };

  // Load sample data into registration form
  const handleLoadSample = () => {
    handleLoadSpecificPreset('pune');
  };

  const handleClear = () => {
    setRegForm({
      parcelId: '',
      propertyNumber: '',
      surveyNumber: '',
      location: '',
      state: 'Maharashtra',
      district: 'Pune',
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
      setFormError('Please enter Property ID and Property Number first.');
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
      setFormError('Please enter a valid unique Parcel ID (e.g. PROP-MH-PUN-005).');
      return;
    }

    if (!regForm.propertyNumber.trim()) {
      setFormError('Please enter the Physical Property CTS/Plot Number.');
      return;
    }

    if (!regForm.initialOwnerAddress.trim() || !regForm.initialOwnerAddress.startsWith('0x')) {
      setFormError('Please enter a valid Ethereum wallet address for the Initial Owner.');
      return;
    }

    if (Number(regForm.areaSqFt) <= 0) {
      setFormError('Property Area must be a positive number greater than 0.');
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
      onNotify('success', 'Parcel Registered On-Chain', result.message, result.txHash);
      handleClear();
    } else {
      setFormError(result.message);
      onNotify('error', 'Registration Reverted', result.message);
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
      onNotify('error', 'Validation Error', 'Please select a property parcel.');
      return;
    }
    const result = await addEncumbrance({
      parcelId: encForm.parcelId,
      kind: encForm.kind,
      ref: encForm.ref,
      details: encForm.details,
    });

    if (result.success) {
      onNotify('success', 'Encumbrance Recorded', result.message, result.txHash);
    } else {
      onNotify('error', 'Encumbrance Failed', result.message);
    }
  };

  // Handle Release Encumbrance
  const handleReleaseEnc = async (parcelId: string, encId: string) => {
    const result = await releaseEncumbrance(parcelId, encId);
    if (result.success) {
      onNotify('success', 'Lien Released', result.message, result.txHash);
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
            Active Identity: {currentAccount.name} ({currentAccount.roleLabel})
          </h3>
          <p className="text-xs text-[#6c757d] mt-0.5">
            Wallet:{' '}
            <span className="font-mono text-[#1a1a1a] font-semibold">{currentAccount.address}</span>
          </p>
          {!isRegistrarOrAdmin && (
            <p className="text-xs text-[#f59f00] mt-1 font-semibold">
              Notice: You are currently simulating a non-registrar account. Registration transactions will revert with{' '}
              <code className="bg-[#fff9db] px-1.5 py-0.5 rounded text-[#e03131] font-mono border border-[#ffec99]">
                "Not authorized registrar"
              </code>{' '}
              unless you switch to the District Land Registrar in the top header.
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
              <h2 className="text-base font-bold text-[#1a1a1a] tracking-tight">Register New Land Parcel</h2>
            </div>
            <p className="text-xs text-[#6c757d] mt-0.5 font-medium">
              Record physical parcel boundaries, survey cadastral numbers, and initial owner on the immutable ledger.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold text-[#6c757d] mr-1">Quick Sample Presets:</span>
            <button
              type="button"
              onClick={() => handleLoadSpecificPreset('pune')}
              className="px-2.5 py-1 rounded-md bg-[#f8f9fa] hover:bg-[#e9ecef] text-[#1a1a1a] border border-[#ced4da] text-[11px] font-bold transition-colors"
            >
              🏡 Pune Villa
            </button>
            <button
              type="button"
              onClick={() => handleLoadSpecificPreset('bengaluru')}
              className="px-2.5 py-1 rounded-md bg-[#f8f9fa] hover:bg-[#e9ecef] text-[#1a1a1a] border border-[#ced4da] text-[11px] font-bold transition-colors"
            >
              🏢 BLR Tech Park
            </button>
            <button
              type="button"
              onClick={() => handleLoadSpecificPreset('nashik')}
              className="px-2.5 py-1 rounded-md bg-[#f8f9fa] hover:bg-[#e9ecef] text-[#1a1a1a] border border-[#ced4da] text-[11px] font-bold transition-colors"
            >
              🌾 Nashik Farm
            </button>
            <button
              type="button"
              onClick={() => handleLoadSpecificPreset('thane')}
              className="px-2.5 py-1 rounded-md bg-[#f8f9fa] hover:bg-[#e9ecef] text-[#1a1a1a] border border-[#ced4da] text-[11px] font-bold transition-colors"
            >
              🏭 Thane Logistics
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
                Unique Parcel ID <span className="text-[#e03131]">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. PROP-MH-PUN-005"
                value={regForm.parcelId}
                onChange={e => setRegForm({ ...regForm, parcelId: e.target.value })}
                className="w-full bg-[#f8f9fa] border border-[#ced4da] rounded-lg px-3.5 py-2 text-xs text-[#1a1a1a] focus:bg-white focus:outline-none focus:border-[#1a1a1a] font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#495057] mb-1">
                Property CTS / Plot Number <span className="text-[#e03131]">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. CTS-Plot-98/1A"
                value={regForm.propertyNumber}
                onChange={e => setRegForm({ ...regForm, propertyNumber: e.target.value })}
                className="w-full bg-[#f8f9fa] border border-[#ced4da] rounded-lg px-3.5 py-2 text-xs text-[#1a1a1a] focus:bg-white focus:outline-none focus:border-[#1a1a1a]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#495057] mb-1">
                Cadastral Survey Number <span className="text-[#e03131]">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Survey 84, Hissa 3"
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
                placeholder="e.g. Aundh Road, Pune, Maharashtra 411007"
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
                placeholder="e.g. 3600"
                value={regForm.areaSqFt || ''}
                onChange={e => setRegForm({ ...regForm, areaSqFt: Number(e.target.value) })}
                className="w-full bg-[#f8f9fa] border border-[#ced4da] rounded-lg px-3.5 py-2 text-xs text-[#1a1a1a] focus:bg-white focus:outline-none focus:border-[#1a1a1a]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#495057] mb-1">
                GIS Geohash Reference
              </label>
              <input
                type="text"
                placeholder="e.g. tek3v28uq1"
                value={regForm.geoHash}
                onChange={e => setRegForm({ ...regForm, geoHash: e.target.value })}
                className="w-full bg-[#f8f9fa] border border-[#ced4da] rounded-lg px-3.5 py-2 text-xs text-[#1a1a1a] focus:bg-white focus:outline-none focus:border-[#1a1a1a] font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#495057] mb-1">
                Initial Owner Wallet Address <span className="text-[#e03131]">*</span>
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
                  Cryptographic Document SHA-256 Hash <span className="text-[#e03131]">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleGenerateHash}
                  className="text-[11px] text-[#1971c2] hover:underline font-bold"
                >
                  Generate SHA-256 Hash
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
                Initial Deed IPFS URI
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
              <span>{isSubmitting ? 'Recording on Blockchain...' : 'REGISTER PARCEL ON BLOCKCHAIN'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* SECTION B: Cadastral Survey & Title Verification Queue */}
      <div className="bg-white border border-[#e9ecef] rounded-xl p-6 shadow-xs">
        <div className="border-b border-[#e9ecef] pb-4 mb-5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-[#1971c2] bg-[#e7f5ff] px-2 py-0.5 rounded border border-[#a5d8ff]">
              STEP 2
            </span>
            <h2 className="text-base font-bold text-[#1a1a1a] tracking-tight">
              Cadastral Verification Queue ({unverifiedParcels.length})
            </h2>
          </div>
          <p className="text-xs text-[#6c757d] mt-0.5 font-medium">
            Cadastral Surveyors and Registrars review physical ground-truth measurements and approve on-chain title verification.
          </p>
        </div>

        {unverifiedParcels.length === 0 ? (
          <div className="p-6 rounded-xl bg-[#f8f9fa] text-center border border-[#e9ecef]">
            <CheckCircle2 className="w-8 h-8 text-[#0ca678] mx-auto mb-2" />
            <p className="text-sm font-bold text-[#1a1a1a]">All Registered Properties Are Verified</p>
            <p className="text-xs text-[#6c757d] mt-0.5 font-medium">No pending inspection requests in queue.</p>
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
                    <span>VERIFY PARCEL</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION C: Notary & Bank Lien (Encumbrance) Management */}
      <div className="bg-white border border-[#e9ecef] rounded-xl p-6 shadow-xs">
        <div className="border-b border-[#e9ecef] pb-4 mb-5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-[#ae3ec9] bg-[#f3d9fa] px-2 py-0.5 rounded border border-[#eebefa]">
              LEGAL NOTARY
            </span>
            <h2 className="text-base font-bold text-[#1a1a1a] tracking-tight">
              Encumbrances, Mortgages & Lien Clearance
            </h2>
          </div>
          <p className="text-xs text-[#6c757d] mt-0.5 font-medium">
            Legal notaries and banks record mortgages or court stay orders. Active liens block smart contract title mutations.
          </p>
        </div>

        {/* Place Encumbrance Form */}
        <form onSubmit={handleAddEncumbrance} className="p-4 bg-[#f8f9fa] rounded-xl border border-[#e9ecef] mb-6">
          <h4 className="text-xs font-bold text-[#1a1a1a] uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-[#e03131]" />
            <span>Record New Mortgage / Encumbrance</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#495057] mb-1">Target Property Parcel</label>
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
              <label className="block text-xs font-bold text-[#495057] mb-1">Encumbrance Type</label>
              <select
                value={encForm.kind}
                onChange={e => setEncForm({ ...encForm, kind: e.target.value as EncumbranceKind })}
                className="w-full bg-white border border-[#ced4da] rounded-lg px-3 py-2 text-xs text-[#1a1a1a] focus:outline-none focus:border-[#1a1a1a]"
              >
                <option value="MORTGAGE">MORTGAGE (Bank Loan)</option>
                <option value="COURT_ORDER">COURT_ORDER (Litigation Stay)</option>
                <option value="TAX_LIEN">TAX_LIEN (Revenue Department)</option>
                <option value="BANK_LIEN">BANK_LIEN (Corporate Guarantee)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#495057] mb-1">Legal Reference No.</label>
              <input
                type="text"
                value={encForm.ref}
                onChange={e => setEncForm({ ...encForm, ref: e.target.value })}
                className="w-full bg-white border border-[#ced4da] rounded-lg px-3 py-2 text-xs text-[#1a1a1a] focus:outline-none focus:border-[#1a1a1a]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#495057] mb-1">Lien Particulars / Loan Details</label>
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
                RECORD LIEN ON-CHAIN
              </button>
            </div>
          </div>
        </form>

        {/* Active Encumbrances List */}
        <div>
          <h4 className="text-xs font-bold text-[#6c757d] uppercase tracking-wider mb-3">
            Currently Encumbered Properties ({encumberedParcels.length})
          </h4>

          {encumberedParcels.length === 0 ? (
            <div className="p-4 rounded-xl bg-[#f8f9fa] text-xs text-[#6c757d] text-center border border-[#e9ecef] font-medium">
              No active mortgages or legal liens in the registry.
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
                        <span>RELEASE LIEN</span>
                      </button>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* SECTION D: Role Permissions & Governance Matrix (PDF Section 5) */}
      <div className="bg-white border border-[#e9ecef] rounded-xl p-6 shadow-xs">
        <h3 className="text-sm font-bold text-[#1a1a1a] uppercase tracking-wider mb-4 flex items-center gap-2">
          <Users className="w-4 h-4 text-[#0ca678]" />
          <span>Role Permissions Matrix (Smart Contract Access Control)</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#e9ecef] text-[#6c757d] bg-[#f8f9fa]">
                <th className="py-2.5 px-3 font-bold">Actor / Role</th>
                <th className="py-2.5 px-3 font-bold">Register Parcel</th>
                <th className="py-2.5 px-3 font-bold">Verify Record</th>
                <th className="py-2.5 px-3 font-bold">Attach / Clear Lien</th>
                <th className="py-2.5 px-3 font-bold">Transfer Title</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e9ecef] font-mono text-[11px]">
              <tr>
                <td className="py-2.5 px-3 font-bold text-[#0ca678]">ADMIN / REGISTRAR</td>
                <td className="py-2.5 px-3 text-[#0ca678] font-bold">✓ YES (registerParcel)</td>
                <td className="py-2.5 px-3 text-[#0ca678] font-bold">✓ YES (verifyProperty)</td>
                <td className="py-2.5 px-3 text-[#0ca678] font-bold">✓ YES</td>
                <td className="py-2.5 px-3 text-[#adb5bd]">✗ No (Only if owner/notary)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-[#1971c2]">CADASTRAL SURVEYOR</td>
                <td className="py-2.5 px-3 text-[#adb5bd]">✗ No</td>
                <td className="py-2.5 px-3 text-[#1971c2] font-bold">✓ YES (verifyProperty)</td>
                <td className="py-2.5 px-3 text-[#adb5bd]">✗ No</td>
                <td className="py-2.5 px-3 text-[#adb5bd]">✗ No</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-[#ae3ec9]">LEGAL NOTARY</td>
                <td className="py-2.5 px-3 text-[#adb5bd]">✗ No</td>
                <td className="py-2.5 px-3 text-[#adb5bd]">✗ No</td>
                <td className="py-2.5 px-3 text-[#ae3ec9] font-bold">✓ YES (add/releaseEncumbrance)</td>
                <td className="py-2.5 px-3 text-[#ae3ec9] font-bold">✓ YES (Authorizes mutation)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-[#f59f00]">PROPERTY OWNER (Citizen)</td>
                <td className="py-2.5 px-3 text-[#adb5bd]">✗ No</td>
                <td className="py-2.5 px-3 text-[#adb5bd]">✗ No</td>
                <td className="py-2.5 px-3 text-[#adb5bd]">✗ No</td>
                <td className="py-2.5 px-3 text-[#f59f00] font-bold">✓ YES (transferTitle - owned only)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-[#e03131]">UNAUTHORIZED CALLER</td>
                <td className="py-2.5 px-3 text-[#e03131] font-bold">✗ REVERTS ("Not registrar")</td>
                <td className="py-2.5 px-3 text-[#e03131] font-bold">✗ REVERTS ("Unauthorized")</td>
                <td className="py-2.5 px-3 text-[#e03131] font-bold">✗ REVERTS ("Not notary")</td>
                <td className="py-2.5 px-3 text-[#e03131] font-bold">✗ REVERTS ("Not owner")</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
