import React, { useState } from 'react';
import { useBlockchain } from '../../context/BlockchainContext';
import { Property, PropertyStatus } from '../../types';
import { shortenAddress, shortenHash, formatTimestamp } from '../../utils/crypto';
import {
  Search,
  Building,
  ShieldCheck,
  ShieldAlert,
  Clock,
  History,
  FileText,
  MapPin,
  Maximize2,
  ExternalLink,
  Lock,
  Unlock,
  CheckCircle2,
  ArrowRight,
  Filter,
  Copy,
  Check,
  AlertTriangle,
} from 'lucide-react';

export const PublicExplorerTab: React.FC = () => {
  const { properties } = useBlockchain();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(text);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  // Filter properties
  const filteredProperties = properties.filter(prop => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      prop.parcelId.toLowerCase().includes(q) ||
      prop.propertyNumber.toLowerCase().includes(q) ||
      prop.surveyNumber.toLowerCase().includes(q) ||
      prop.location.toLowerCase().includes(q) ||
      prop.currentOwner.toLowerCase().includes(q) ||
      prop.currentOwnerName.toLowerCase().includes(q);

    if (selectedStatus === 'ALL') return matchesSearch;
    if (selectedStatus === 'VERIFIED') return matchesSearch && prop.verified && !prop.encumbrances.some(e => e.active);
    if (selectedStatus === 'UNVERIFIED') return matchesSearch && !prop.verified;
    if (selectedStatus === 'ENCUMBERED') return matchesSearch && prop.encumbrances.some(e => e.active);
    if (selectedStatus === 'TRANSFERRED') return matchesSearch && prop.titleHistory.length > 1;
    return matchesSearch;
  });

  // Calculate live statistics
  const totalParcels = properties.length;
  const verifiedParcels = properties.filter(p => p.verified).length;
  const encumberedParcels = properties.filter(p => p.encumbrances.some(e => e.active)).length;
  const totalMutations = properties.reduce((acc, p) => acc + (p.titleHistory.length - 1), 0);

  const getStatusBadge = (status: PropertyStatus, verified: boolean, encumbrances: any[]) => {
    const hasActiveLien = encumbrances.some(e => e.active);
    if (hasActiveLien) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#fff5f5] border border-[#ffc9c9] text-[#e03131]">
          <Lock className="w-3 h-3 text-[#e03131]" />
          <span>ENCUMBERED (Lien Active)</span>
        </span>
      );
    }
    if (verified) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#e6fcf5] border border-[#b2f2bb] text-[#0ca678]">
          <ShieldCheck className="w-3 h-3 text-[#0ca678]" />
          <span>VERIFIED TITLE</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#fff9db] border border-[#ffec99] text-[#f59f00]">
        <Clock className="w-3 h-3 text-[#f59f00]" />
        <span>PENDING VERIFICATION</span>
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Overview Statistics Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white border border-[#e9ecef] p-4 rounded-xl shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-[#6c757d]">Total Registered Parcels</p>
          <p className="text-2xl font-bold text-[#1a1a1a] mt-1">{totalParcels.toString().padStart(2, '0')}</p>
          <p className="text-[11px] text-[#adb5bd] mt-1">Recorded on blockchain state</p>
        </div>

        <div className="bg-white border border-[#e9ecef] p-4 rounded-xl shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-[#6c757d]">Verified Titles</p>
          <p className="text-2xl font-bold text-[#0ca678] mt-1">{verifiedParcels.toString().padStart(2, '0')}</p>
          <p className="text-[11px] text-[#adb5bd] mt-1">Cadastral survey checked</p>
        </div>

        <div className="bg-white border border-[#e9ecef] p-4 rounded-xl shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-[#6c757d]">Encumbered / Liens</p>
          <p className="text-2xl font-bold text-[#e03131] mt-1">{encumberedParcels.toString().padStart(2, '0')}</p>
          <p className="text-[11px] text-[#adb5bd] mt-1">Bank mortgage / Stay active</p>
        </div>

        <div className="bg-white border border-[#e9ecef] p-4 rounded-xl shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-[#6c757d]">Title Mutations</p>
          <p className="text-2xl font-bold text-[#1971c2] mt-1">{totalMutations.toString().padStart(2, '0')}</p>
          <p className="text-[11px] text-[#adb5bd] mt-1">On-chain ownership transfers</p>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white border border-[#e9ecef] p-4 rounded-xl shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-[#adb5bd] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Parcel ID, Survey No, Location, Owner..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-[#f8f9fa] border border-[#ced4da] rounded-lg pl-10 pr-4 py-2 text-xs text-[#1a1a1a] placeholder-[#adb5bd] focus:bg-white focus:outline-none focus:border-[#1a1a1a] transition-colors"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
            {['ALL', 'VERIFIED', 'UNVERIFIED', 'ENCUMBERED', 'TRANSFERRED'].map(status => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                  selectedStatus === status
                    ? 'bg-[#1a1a1a] text-white shadow-xs'
                    : 'bg-[#f8f9fa] text-[#495057] hover:text-[#1a1a1a] hover:bg-[#e9ecef] border border-[#e9ecef]'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Sample Search Tags */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-[#f1f3f5] text-[11px]">
          <span className="text-[#6c757d] font-bold mr-1">Sample Search Inputs:</span>
          {[
            { label: 'PROP-MH-PUN-001', val: 'PROP-MH-PUN-001' },
            { label: 'Baner Hill', val: 'Baner Hill' },
            { label: 'Aarav Sharma', val: 'Aarav Sharma' },
            { label: 'Priya Patel', val: 'Priya Patel' },
            { label: 'Shivaji Nagar', val: 'Shivaji Nagar' },
          ].map(tag => (
            <button
              key={tag.label}
              onClick={() => setSearchQuery(tag.val)}
              className={`px-2 py-0.5 rounded border transition-colors ${
                searchQuery === tag.val
                  ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]'
                  : 'bg-[#f8f9fa] text-[#495057] border-[#e9ecef] hover:bg-[#e9ecef] hover:text-[#1a1a1a]'
              }`}
            >
              🔍 {tag.label}
            </button>
          ))}
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-[#e03131] hover:underline font-bold ml-1"
            >
              Clear Search
            </button>
          )}
        </div>
      </div>

      {/* Property Cards Grid */}
      {filteredProperties.length === 0 ? (
        <div className="bg-white border border-dashed border-[#ced4da] p-12 rounded-xl text-center">
          <Building className="w-12 h-12 text-[#adb5bd] mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#1a1a1a]">No Matching Properties Found</h3>
          <p className="text-xs text-[#6c757d] mt-1">Try adjusting your search keywords or filter criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProperties.map(prop => {
            const hasActiveLien = prop.encumbrances.some(e => e.active);
            return (
              <div
                key={prop.parcelId}
                className="bg-white border border-[#e9ecef] hover:border-[#ced4da] rounded-xl p-5 flex flex-col justify-between transition-all shadow-xs group"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <span className="text-[11px] font-mono font-bold text-[#0ca678] bg-[#e6fcf5] px-2 py-0.5 rounded border border-[#b2f2bb]">
                        {prop.parcelId}
                      </span>
                      <h3 className="text-base font-bold text-[#1a1a1a] mt-1.5 group-hover:text-[#0ca678] transition-colors">
                        {prop.propertyNumber}
                      </h3>
                      <p className="text-xs text-[#6c757d] font-medium">{prop.surveyNumber}</p>
                    </div>

                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#f1f3f5] text-[#495057] border border-[#e9ecef]">
                      {prop.propertyType}
                    </span>
                  </div>

                  {/* Location & Status */}
                  <div className="space-y-2 text-xs py-3 border-y border-[#f1f3f5]">
                    <div className="flex items-start gap-1.5 text-[#495057]">
                      <MapPin className="w-3.5 h-3.5 text-[#adb5bd] shrink-0 mt-0.5" />
                      <span className="line-clamp-1 font-medium">{prop.location}</span>
                    </div>

                    <div className="flex items-center justify-between text-[#6c757d]">
                      <span>Area:</span>
                      <span className="font-bold text-[#1a1a1a]">{prop.areaSqFt.toLocaleString()} sq.ft.</span>
                    </div>

                    <div className="flex items-center justify-between text-[#6c757d]">
                      <span>Current Owner:</span>
                      <span className="font-bold text-[#1a1a1a] truncate max-w-[150px]" title={prop.currentOwner}>
                        {prop.currentOwnerName}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[#6c757d] font-mono text-[11px]">
                      <span>Owner Wallet:</span>
                      <span className="text-[#495057]">{shortenAddress(prop.currentOwner)}</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="mt-4 pt-2 flex items-center justify-between">
                  <div>{getStatusBadge(prop.status, prop.verified, prop.encumbrances)}</div>

                  <button
                    onClick={() => setSelectedProperty(prop)}
                    className="flex items-center gap-1 text-xs font-bold text-[#1a1a1a] hover:text-[#0ca678] transition-colors"
                  >
                    <span>View Provenance</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Property Provenance & Title Inspector Modal */}
      {selectedProperty && (
        <div className="fixed inset-0 z-50 bg-[#1a1a1a]/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-[#e9ecef] rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#e9ecef] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[#0ca678] bg-[#e6fcf5] px-2 py-0.5 rounded border border-[#b2f2bb]">
                    {selectedProperty.parcelId}
                  </span>
                  <span className="text-xs uppercase font-bold px-2 py-0.5 rounded bg-[#f1f3f5] text-[#495057] border border-[#e9ecef]">
                    {selectedProperty.propertyType}
                  </span>
                  {selectedProperty.verified && (
                    <span className="text-xs font-bold text-[#0ca678] flex items-center gap-1 bg-[#e6fcf5] px-2 py-0.5 rounded-full border border-[#b2f2bb]">
                      <ShieldCheck className="w-3.5 h-3.5" /> Verified by Land Authority
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-bold text-[#1a1a1a] mt-1.5">{selectedProperty.propertyNumber}</h2>
                <p className="text-xs text-[#6c757d]">{selectedProperty.location}</p>
              </div>

              <button
                onClick={() => setSelectedProperty(null)}
                className="text-[#adb5bd] hover:text-[#1a1a1a] p-2 rounded-lg bg-[#f8f9fa] hover:bg-[#e9ecef] transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Property Overview Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-5 p-4 bg-[#f8f9fa] rounded-xl border border-[#e9ecef] text-xs">
              <div>
                <span className="text-[#6c757d] block font-medium">Survey Number</span>
                <span className="font-bold text-[#1a1a1a]">{selectedProperty.surveyNumber}</span>
              </div>
              <div>
                <span className="text-[#6c757d] block font-medium">Total Area</span>
                <span className="font-bold text-[#1a1a1a]">{selectedProperty.areaSqFt.toLocaleString()} sq. ft.</span>
              </div>
              <div>
                <span className="text-[#6c757d] block font-medium">Geohash Reference</span>
                <span className="font-mono font-bold text-[#0ca678]">{selectedProperty.geoHash}</span>
              </div>
              <div>
                <span className="text-[#6c757d] block font-medium">Registered At</span>
                <span className="text-[#495057] font-medium">{formatTimestamp(selectedProperty.registeredAt)}</span>
              </div>
              <div>
                <span className="text-[#6c757d] block font-medium">Active Status</span>
                <span className="font-bold text-[#1a1a1a]">{selectedProperty.status}</span>
              </div>
              <div>
                <span className="text-[#6c757d] block font-medium">Est. Market Value</span>
                <span className="font-bold text-[#f59f00]">{selectedProperty.marketValueEth || 20} ETH</span>
              </div>
            </div>

            {/* Current Owner Box */}
            <div className="p-4 rounded-xl bg-[#f8f9fa] border border-[#e9ecef] mb-5">
              <h4 className="text-xs font-bold text-[#6c757d] uppercase tracking-wider mb-2">
                Current Legal Title Holder
              </h4>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-bold text-[#1a1a1a]">{selectedProperty.currentOwnerName}</p>
                  <p className="text-xs font-mono text-[#6c757d] mt-0.5 flex items-center gap-1.5">
                    <span>{selectedProperty.currentOwner}</span>
                    <button
                      onClick={() => handleCopy(selectedProperty.currentOwner)}
                      className="text-[#adb5bd] hover:text-[#1a1a1a]"
                    >
                      {copiedHash === selectedProperty.currentOwner ? (
                        <Check className="w-3.5 h-3.5 text-[#0ca678]" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[11px] bg-[#e6fcf5] border border-[#b2f2bb] text-[#0ca678] px-2.5 py-1 rounded-full font-bold">
                    Active On-Chain Title
                  </span>
                </div>
              </div>
            </div>

            {/* Document Hash & Integrity Section */}
            <div className="p-4 rounded-xl bg-[#f8f9fa] border border-[#e9ecef] mb-5">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-[#6c757d] uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#1971c2]" />
                  <span>On-Chain Cryptographic Document Hash (SHA-256)</span>
                </h4>
                <span className="text-[10px] text-[#adb5bd] font-mono font-bold">Immutable</span>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-[#ced4da] flex items-center justify-between gap-2">
                <span className="text-xs font-mono text-[#1a1a1a] break-all font-semibold">{selectedProperty.documentHash}</span>
                <button
                  onClick={() => handleCopy(selectedProperty.documentHash)}
                  className="shrink-0 p-1.5 rounded hover:bg-[#f1f3f5] text-[#adb5bd] hover:text-[#1a1a1a] transition-colors"
                  title="Copy Document Hash"
                >
                  {copiedHash === selectedProperty.documentHash ? (
                    <Check className="w-4 h-4 text-[#0ca678]" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-[11px] text-[#6c757d] mt-1.5">
                Supporting survey documents and deeds remain off-chain (IPFS) for privacy & gas optimization. Any alteration to the original deed produces a mismatched hash.
              </p>
            </div>

            {/* Encumbrances / Liens */}
            <div className="mb-5">
              <h4 className="text-xs font-bold text-[#6c757d] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#e03131]" />
                <span>Encumbrances, Mortgages & Legal Liens ({selectedProperty.encumbrances.length})</span>
              </h4>

              {selectedProperty.encumbrances.length === 0 ? (
                <div className="p-3.5 rounded-xl bg-[#e6fcf5] border border-[#b2f2bb] text-[#0ca678] text-xs flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#0ca678] shrink-0" />
                  <span>No active encumbrances or court stays recorded. Property is free for transfer.</span>
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedProperty.encumbrances.map((enc, idx) => (
                    <div
                      key={enc.id || idx}
                      className={`p-3 rounded-xl border text-xs ${
                        enc.active
                          ? 'bg-[#fff5f5] border-[#ffc9c9] text-[#1a1a1a]'
                          : 'bg-[#f8f9fa] border-[#e9ecef] text-[#6c757d]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold flex items-center gap-1.5 text-[#1a1a1a]">
                          {enc.active ? <Lock className="w-3.5 h-3.5 text-[#e03131]" /> : <Unlock className="w-3.5 h-3.5 text-[#adb5bd]" />}
                          <span>{enc.kind}: {enc.ref}</span>
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${enc.active ? 'bg-[#ffc9c9] text-[#e03131]' : 'bg-[#e9ecef] text-[#6c757d]'}`}>
                          {enc.active ? 'ACTIVE LIEN (Transfers Locked)' : 'RELEASED'}
                        </span>
                      </div>
                      <p className="mt-1 text-[#495057]">{enc.details}</p>
                      <p className="text-[10px] text-[#adb5bd] mt-1 font-mono">Issued by: {enc.byName} ({shortenAddress(enc.by)}) on {formatTimestamp(enc.createdAt)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Title Provenance & History Trail */}
            <div>
              <h4 className="text-xs font-bold text-[#6c757d] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-[#1971c2]" />
                <span>On-Chain Title Provenance & Mutation Trail ({selectedProperty.titleHistory.length} Titles)</span>
              </h4>

              <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#dee2e6]">
                {selectedProperty.titleHistory.map((title, i) => (
                  <div key={i} className="flex items-start gap-3 relative pl-6">
                    <div
                      className={`absolute left-1.5 top-1.5 w-3 h-3 rounded-full -translate-x-1/2 border-2 ${
                        title.active ? 'bg-[#0ca678] border-white ring-2 ring-[#b2f2bb]' : 'bg-[#adb5bd] border-white'
                      }`}
                    />

                    <div className="flex-1 bg-[#f8f9fa] p-3 rounded-xl border border-[#e9ecef] text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#1a1a1a]">
                          {i === 0 ? 'Genesis Allotment' : `Mutation #${i}`} — {title.ownerName}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${title.active ? 'bg-[#e6fcf5] text-[#0ca678] border border-[#b2f2bb]' : 'bg-[#e9ecef] text-[#6c757d]'}`}>
                          {title.active ? 'ACTIVE OWNER' : 'HISTORICAL PREDECESSOR'}
                        </span>
                      </div>

                      <div className="mt-2 space-y-1 font-mono text-[11px] text-[#6c757d]">
                        <p>Owner Address: <span className="text-[#1a1a1a] font-medium">{title.owner}</span></p>
                        <p>Timestamp: <span className="text-[#495057]">{formatTimestamp(title.registeredAt)}</span></p>
                        <p>Deed Reference: <span className="text-[#1971c2] font-semibold">{title.deedURI}</span></p>
                        <p className="text-[#adb5bd]">Tx Hash: {title.txHash}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 pt-4 border-t border-[#e9ecef] flex justify-end">
              <button
                onClick={() => setSelectedProperty(null)}
                className="px-4 py-2 rounded-lg bg-[#1a1a1a] hover:bg-[#2d3436] text-white text-xs font-bold transition-colors shadow-xs"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
