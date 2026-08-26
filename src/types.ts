export type PropertyStatus = 'REGISTERED' | 'VERIFIED' | 'TRANSFER_PENDING' | 'TRANSFERRED' | 'ENCUMBERED' | 'DISPUTED';

export type PropertyType = 'RESIDENTIAL' | 'COMMERCIAL' | 'AGRICULTURAL' | 'INDUSTRIAL' | 'GOVERNMENT';

export type EncumbranceKind = 'MORTGAGE' | 'COURT_ORDER' | 'TAX_LIEN' | 'BANK_LIEN' | 'EASEMENT';

export interface Title {
  owner: string;
  ownerName: string;
  registeredAt: number; // Unix timestamp
  active: boolean;
  deedURI: string;
  txHash: string;
}

export interface Encumbrance {
  id: string;
  kind: EncumbranceKind;
  by: string; // Authority / Bank address
  byName: string;
  active: boolean;
  ref: string; // IPFS reference or legal notice ID
  createdAt: number;
  releasedAt?: number;
  details: string;
}

export interface Property {
  parcelId: string; // e.g. "PROP-MH-PUN-001" or bytes32 hash
  propertyNumber: string; // e.g. "CTS-Plot-789/2"
  surveyNumber: string; // e.g. "Survey No. 45/2B"
  location: string; // e.g. "Baner, Pune, Maharashtra"
  state: string;
  district: string;
  areaSqFt: number;
  propertyType: PropertyType;
  geoHash: string; // e.g. "tek3v2" or lat/lng geo-reference
  coordinates: { lat: number; lng: number };
  metadataURI: string; // IPFS URI
  documentHash: string; // SHA-256 hash of title document
  currentOwner: string; // Wallet address
  currentOwnerName: string;
  previousOwner?: string;
  previousOwnerName?: string;
  status: PropertyStatus;
  verified: boolean;
  verifiedBy?: string;
  verifiedAt?: number;
  registeredAt: number;
  lastTransferredAt?: number;
  marketValueEth?: number;
  encumbrances: Encumbrance[];
  titleHistory: Title[];
}

export interface UserAccount {
  address: string;
  name: string;
  role: 'ADMIN' | 'REGISTRAR' | 'SURVEYOR' | 'NOTARY' | 'CITIZEN' | 'UNAUTHORIZED';
  roleLabel: string;
  balanceEth: number;
  avatarColor: string;
  description: string;
}

export interface TransactionLog {
  id: string;
  txHash: string;
  blockNumber: number;
  timestamp: number;
  from: string;
  fromName: string;
  toContract: string;
  method: string;
  status: 'CONFIRMED' | 'REVERTED';
  gasUsed: number;
  eventEmitted?: string;
  details: string;
  errorReason?: string;
}

export interface BlockchainBlock {
  blockNumber: number;
  hash: string;
  previousHash: string;
  timestamp: number;
  transactionsCount: number;
  miner: string;
  gasUsed: number;
}

export interface TestCase {
  id: number;
  name: string;
  category: 'REGISTRATION' | 'VERIFICATION' | 'TRANSFER' | 'ENCUMBRANCE' | 'SECURITY' | 'HASHING';
  description: string;
  initialCondition: string;
  action: string;
  expectedResult: string;
  expectedRevert?: string;
  status: 'IDLE' | 'RUNNING' | 'PASSED' | 'FAILED';
  executionLog?: string;
  durationMs?: number;
}

export interface InterviewQA {
  id: number;
  question: string;
  category: string;
  keyConcepts: string[];
  answer: string;
  studentTip: string;
}
