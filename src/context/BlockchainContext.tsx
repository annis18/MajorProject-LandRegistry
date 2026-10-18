import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Property, UserAccount, TransactionLog, BlockchainBlock, TestCase, PropertyStatus, EncumbranceKind } from '../types';
import { INITIAL_ACCOUNTS, INITIAL_PROPERTIES, INITIAL_BLOCKS, CONTRACT_ADDRESS } from '../data/mockData';
import { generateTxHash, generateKeccak256 } from '../utils/crypto';

interface BlockchainContextType {
  properties: Property[];
  accounts: UserAccount[];
  currentAccount: UserAccount;
  setCurrentAccount: (account: UserAccount) => void;
  blocks: BlockchainBlock[];
  transactions: TransactionLog[];
  contractAddress: string;
  isMetaMaskConnected: boolean;
  metaMaskAddress: string | null;
  connectMetaMask: () => Promise<void>;
  
  liveContract: any;
  setLiveContract: React.Dispatch<any>;
  
  registerProperty: (params: {
    parcelId: string;
    propertyNumber: string;
    surveyNumber: string;
    location: string;
    state: string;
    district: string;
    areaSqFt: number;
    propertyType: Property['propertyType'];
    geoHash: string;
    metadataURI: string;
    documentHash: string;
    initialOwnerAddress: string;
    deedURI: string;
    marketValueEth?: number;
  }) => Promise<{ success: boolean; message: string; txHash?: string }>;

  verifyProperty: (parcelId: string) => Promise<{ success: boolean; message: string; txHash?: string }>;

  addEncumbrance: (params: {
    parcelId: string;
    kind: EncumbranceKind;
    ref: string;
    details: string;
  }) => Promise<{ success: boolean; message: string; txHash?: string }>;

  releaseEncumbrance: (parcelId: string, encumbranceId: string) => Promise<{ success: boolean; message: string; txHash?: string }>;

  transferOwnership: (params: {
    parcelId: string;
    newOwnerAddress: string;
    newDeedURI?: string;
  }) => Promise<{ success: boolean; message: string; txHash?: string }>;

  testCases: TestCase[];
  runAllTests: () => Promise<void>;
  isRunningTests: boolean;
  resetDemoState: () => void;
  loadSamplePropertyData: () => any;
}

const BlockchainContext = createContext<BlockchainContextType | undefined>(undefined);
const STORAGE_KEY = 'LANDCHAIN_BLOCKCHAIN_DATA_V2';

export const BlockchainProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [accounts] = useState<UserAccount[]>(INITIAL_ACCOUNTS);
  const [currentAccount, setCurrentAccount] = useState<UserAccount>(INITIAL_ACCOUNTS[0]);
  const [isMetaMaskConnected, setIsMetaMaskConnected] = useState(false);
  const [metaMaskAddress, setMetaMaskAddress] = useState<string | null>(null);
  const [liveContract, setLiveContract] = useState<any>(null);

  const [properties, setProperties] = useState<Property[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.properties && Array.isArray(parsed.properties)) {
          return parsed.properties;
        }
      }
    } catch { }
    return INITIAL_PROPERTIES;
  });

  const [blocks, setBlocks] = useState<BlockchainBlock[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.blocks && Array.isArray(parsed.blocks)) {
          return parsed.blocks;
        }
      }
    } catch { }
    return INITIAL_BLOCKS;
  });

  const [transactions, setTransactions] = useState<TransactionLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.transactions && Array.isArray(parsed.transactions)) {
          return parsed.transactions;
        }
      }
    } catch { }
    return [
      {
        id: 'tx-001',
        txHash: '0x8f349d970a202a013ecbf0e8549646b96e95b058fcfbc905e32049e0f317b9b1',
        blockNumber: 101,
        timestamp: 1723500000,
        from: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
        fromName: 'Animesh (Registrar)',
        toContract: CONTRACT_ADDRESS,
        method: 'registerParcel(bytes32,string,string,address)',
        status: 'CONFIRMED',
        gasUsed: 145220,
        eventEmitted: 'ParcelRegistered(PROP-UP-KAN-001)',
        details: 'Genesis registration of Kanpur Civil Lines Plot 45/2B',
      },
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ properties, blocks, transactions }));
    } catch { }
  }, [properties, blocks, transactions]);

  const connectMetaMask = async () => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts && accounts.length > 0) {
          const userAddr = accounts[0];
          setMetaMaskAddress(userAddr);
          setIsMetaMaskConnected(true);
          setCurrentAccount({
            address: userAddr,
            name: 'MetaMask Connected Wallet',
            role: 'CITIZEN',
            roleLabel: 'External Web3 Wallet',
            balanceEth: 5.25,
            avatarColor: 'indigo',
            description: 'Connected via browser Web3 extension',
          });
        }
      } catch (err: any) {
        console.error('MetaMask connection error:', err);
      }
    }
  };

  const recordTransaction = (params: { method: string; details: string; eventEmitted: string; gasUsed?: number; }): { txHash: string; blockNum: number } => {
    const txHash = generateTxHash();
    const latestBlock = blocks[blocks.length - 1] || { blockNumber: 100, hash: '0x000' };
    const newBlockNumber = latestBlock.blockNumber + 1;
    const now = Math.floor(Date.now() / 1000);
    const gasUsed = params.gasUsed || Math.floor(Math.random() * 50000) + 45000;

    const newBlock: BlockchainBlock = {
      blockNumber: newBlockNumber, hash: generateTxHash(), previousHash: latestBlock.hash,
      timestamp: now, transactionsCount: 1, miner: INITIAL_ACCOUNTS[0].address, gasUsed,
    };

    const newTx: TransactionLog = {
      id: 'tx-' + Date.now(), txHash, blockNumber: newBlockNumber, timestamp: now,
      from: currentAccount.address, fromName: currentAccount.name, toContract: CONTRACT_ADDRESS,
      method: params.method, status: 'CONFIRMED', gasUsed, eventEmitted: params.eventEmitted, details: params.details,
    };

    setBlocks(prev => [...prev, newBlock]);
    setTransactions(prev => [newTx, ...prev]);
    return { txHash, blockNum: newBlockNumber };
  };

  const registerProperty = async (params: any): Promise<{ success: boolean; message: string; txHash?: string }> => {
    const cleanId = params.parcelId.trim().toUpperCase();
    
    if (liveContract) {
      try {
        const tx = await liveContract.registerProperty(cleanId, params.location, params.areaSqFt, params.initialOwnerAddress, params.documentHash);
        await tx.wait();
      } catch (error: any) {
        return { success: false, message: `Web3 Contract Revert: ${error.message}` };
      }
    }

    const now = Math.floor(Date.now() / 1000);
    const { txHash } = recordTransaction({
      method: `registerParcel(${cleanId}, ${params.propertyNumber}, ${params.initialOwnerAddress.slice(0, 8)}...)`,
      details: `Registered new parcel ${cleanId} on ${liveContract ? 'Hardhat' : 'Demo'} Network`,
      eventEmitted: `ParcelRegistered(${cleanId})`,
      gasUsed: 165400,
    });

    const newProperty: Property = {
      parcelId: cleanId,
      propertyNumber: params.propertyNumber || `CTS-${cleanId}`,
      surveyNumber: params.surveyNumber || 'Survey 101/A',
      location: params.location,
      state: params.state || 'Uttar Pradesh',
      district: params.district || 'Kanpur Nagar',
      areaSqFt: Number(params.areaSqFt),
      propertyType: params.propertyType,
      geoHash: params.geoHash || 'tu4q9z22',
      coordinates: { lat: 26.4499 + (Math.random() - 0.5) * 0.1, lng: 80.3319 + (Math.random() - 0.5) * 0.1 },
      metadataURI: params.metadataURI || 'ipfs://bafybeidemo' + Date.now(),
      documentHash: params.documentHash,
      currentOwner: params.initialOwnerAddress,
      currentOwnerName: accounts.find(a => a.address.toLowerCase() === params.initialOwnerAddress.toLowerCase())?.name || 'Registered Citizen',
      status: 'REGISTERED',
      verified: false,
      registeredAt: now,
      lastTransferredAt: now,
      marketValueEth: params.marketValueEth || 15.0,
      encumbrances: [],
      titleHistory: [{
        owner: params.initialOwnerAddress, ownerName: accounts.find(a => a.address.toLowerCase() === params.initialOwnerAddress.toLowerCase())?.name || 'Registered Citizen', registeredAt: now,
        active: true, deedURI: params.deedURI || 'ipfs://initial-deed', txHash,
      }],
    };

    setProperties(prev => [newProperty, ...prev]);
    return { success: true, message: `Property ${cleanId} fully registered!`, txHash };
  };

  const verifyProperty = async (parcelId: string): Promise<{ success: boolean; message: string; txHash?: string }> => {
    const propIndex = properties.findIndex(p => p.parcelId === parcelId);
    if (propIndex === -1) return { success: false, message: 'Property missing.' };
    const prop = properties[propIndex];
    const now = Math.floor(Date.now() / 1000);
    const { txHash } = recordTransaction({ method: `verifyProperty(${parcelId})`, details: `Verified physical boundaries by Surveyor`, eventEmitted: `PropertyVerified(${parcelId})`, gasUsed: 38500 });
    const updated = [...properties];
    updated[propIndex] = { ...prop, verified: true, verifiedBy: currentAccount.address, verifiedAt: now, status: 'VERIFIED' };
    setProperties(updated);
    return { success: true, message: `Plot bounds officially verified!`, txHash };
  };

  const addEncumbrance = async (params: any): Promise<{ success: boolean; message: string; txHash?: string }> => {
    const propIndex = properties.findIndex(p => p.parcelId === params.parcelId);
    if (propIndex === -1) return { success: false, message: 'Property missing.' };
    const prop = properties[propIndex];
    const newEncId = 'ENC-' + Date.now();
    const { txHash } = recordTransaction({ method: `addEncumbrance(${params.parcelId}, ${params.kind})`, details: `Attached ${params.kind} to block transfers`, eventEmitted: `EncumbranceAdded(${params.parcelId})`, gasUsed: 62400 });
    
    const updated = [...properties];
    updated[propIndex] = {
      ...prop,
      status: 'ENCUMBERED',
      encumbrances: [...prop.encumbrances, { id: newEncId, kind: params.kind, ref: params.ref, details: params.details, active: true, createdAt: Math.floor(Date.now() / 1000), by: currentAccount.address, byName: currentAccount.name }]
    };
    setProperties(updated);
    return { success: true, message: "Bank loan lock added successfully.", txHash };
  };

  const releaseEncumbrance = async (parcelId: string, encumbranceId: string): Promise<{ success: boolean; message: string; txHash?: string }> => {
    const propIndex = properties.findIndex(p => p.parcelId === parcelId);
    if (propIndex === -1) return { success: false, message: 'Property missing.' };
    const prop = properties[propIndex];
    
    const { txHash } = recordTransaction({ method: `releaseEncumbrance(${parcelId})`, details: `Cleared loan/lock ${encumbranceId}`, eventEmitted: `EncumbranceReleased(${parcelId})`, gasUsed: 42100 });
    
    const updated = [...properties];
    const updatedEncs = prop.encumbrances.map(e => e.id === encumbranceId ? { ...e, active: false } : e);
    const hasActive = updatedEncs.some(e => e.active);
    updated[propIndex] = { ...prop, status: hasActive ? 'ENCUMBERED' : 'VERIFIED', encumbrances: updatedEncs };
    setProperties(updated);
    return { success: true, message: "Loan cleared and plot unlocked.", txHash };
  };

  const transferOwnership = async (params: any): Promise<{ success: boolean; message: string; txHash?: string }> => {
    const propIndex = properties.findIndex(p => p.parcelId === params.parcelId);
    if (propIndex === -1) return { success: false, message: 'Property missing.' };
    const prop = properties[propIndex];
    
    if (prop.encumbrances.some(e => e.active)) return { success: false, message: 'Cannot transfer a property with an active bank loan.' };
    
    const newOwnerName = accounts.find(a => a.address.toLowerCase() === params.newOwnerAddress.toLowerCase())?.name || 'New Buyer';
    const now = Math.floor(Date.now() / 1000);
    const { txHash } = recordTransaction({ method: `transferTitle(${params.parcelId}, ${params.newOwnerAddress.slice(0, 8)}...)`, details: `Transferred ownership to ${newOwnerName}`, eventEmitted: `TitleTransferred(${params.parcelId})`, gasUsed: 125000 });
    
    const updated = [...properties];
    const newHistory = prop.titleHistory.map(t => ({ ...t, active: false }));
    newHistory.push({ owner: params.newOwnerAddress, ownerName: newOwnerName, registeredAt: now, active: true, deedURI: params.newDeedURI || 'ipfs://new-conveyance', txHash });
    
    updated[propIndex] = { ...prop, status: 'TRANSFERRED', currentOwner: params.newOwnerAddress, currentOwnerName: newOwnerName, lastTransferredAt: now, titleHistory: newHistory };
    setProperties(updated);
    return { success: true, message: `Ownership successfully transferred to ${newOwnerName}!`, txHash };
  };

  const resetDemoState = () => {
    localStorage.removeItem(STORAGE_KEY);
    setProperties(INITIAL_PROPERTIES);
    setBlocks(INITIAL_BLOCKS);
    setTransactions([]);
  };

  const loadSamplePropertyData = () => {
    return {
      parcelId: 'PROP-UP-KAN-' + Math.floor(100 + Math.random() * 900),
      propertyNumber: 'Plot-Swaroop-' + Math.floor(10 + Math.random() * 90),
      surveyNumber: 'Survey ' + Math.floor(10 + Math.random() * 90) + '/Block B',
      location: 'Swaroop Nagar, Kanpur, Uttar Pradesh 208002',
      state: 'Uttar Pradesh',
      district: 'Kanpur Nagar',
      areaSqFt: 4200,
      propertyType: 'COMMERCIAL' as const,
      geoHash: 'tu4q9z' + Math.floor(10 + Math.random() * 90),
      metadataURI: 'ipfs://bafybeiswaroopnagarplotcadastraldoc' + Date.now(),
      documentHash: '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      initialOwnerAddress: INITIAL_ACCOUNTS[3].address, // Ayushhh
      deedURI: 'ipfs://conveyancedeed-official-allotment-2026',
      marketValueEth: 24.5,
    };
  };

  return (
    <BlockchainContext.Provider
      value={{
        properties, accounts, currentAccount, setCurrentAccount, blocks, transactions,
        contractAddress: CONTRACT_ADDRESS, isMetaMaskConnected, metaMaskAddress, connectMetaMask,
        liveContract, setLiveContract, 
        registerProperty, verifyProperty, addEncumbrance, releaseEncumbrance, transferOwnership,
        testCases: [], runAllTests: async () => {}, isRunningTests: false, resetDemoState, loadSamplePropertyData,
      }}
    >
      {children}
    </BlockchainContext.Provider>
  );
};

export const useBlockchain = () => {
  const context = useContext(BlockchainContext);
  if (!context) throw new Error('useBlockchain must be used within a BlockchainProvider');
  return context;
};