# Blockchain-Based Land Registry & Property Ownership System

An educational, tamper-evident blockchain land registry prototype using Solidity smart contracts for property parcel registration, role-based cadastral verification, mortgage encumbrance management, document SHA-256 hash verification, and auditable on-chain title mutation history.

---

## 📌 Overview

Traditional land registry systems rely on physical paper records or siloed relational databases that are susceptible to fraudulent alteration, double-selling, and protracted due-diligence delays. 

**LandChain** models an immutable, role-gated property registry powered by Ethereum smart contracts. Real estate deeds remain off-chain (IPFS) for privacy and gas efficiency, while cryptographic SHA-256 digests and title ownership state are immutably anchored on-chain.

---

## 🎯 Objectives

1. **Tamper-Evident Records**: Prevent unauthorized administrative changes to land records through cryptographic immutability.
2. **Eliminate Double-Selling**: Enforce that only the current verified active owner can initiate title conveyance.
3. **Transparent Encumbrances**: Enable banks and legal notaries to flag active mortgages or court stays that lock mutations on-chain.
4. **Instant Title Provenance**: Allow prospective buyers and financial institutions to verify 100% of historical ownership mutations in seconds.
5. **Document Integrity**: Detect any modification to original survey blueprints or deeds through off-chain SHA-256 hash validation.

---

## ⚠️ Educational & Legal Disclaimer

> **IMPORTANT**: This project is an educational prototype developed for blockchain coursework and proof of work. 
> Blockchain technology preserves a tamper-evident record of data entered into the system, but cannot independently guarantee that physical ground-truth measurements or paper claims entered into the registry are legally valid ("Garbage In, Garbage Out"). Real-world implementations require integration with statutory revenue departments, licensed cadastral surveyors, courts, and national digital identity authorities.

---

## 🔄 System Architecture & Workflow

```
[ DISTRICT REGISTRAR ] ──> registerParcel() ──> Status: REGISTERED (unverified)
                                 │
[ CADASTRAL SURVEYOR ] ──> verifyProperty()  ──> Status: VERIFIED (ready for trade)
                                 │
[ LEGAL NOTARY / BANK] ──> addEncumbrance()  ──> Status: ENCUMBERED (transfers locked)
                                 │
[ LEGAL NOTARY / BANK] ──> releaseEncumbrance() ──> Status: VERIFIED (unlocked)
                                 │
[ VERIFIED OWNER     ] ──> transferTitle()    ──> New Title Issued + History Preserved
```

---

## 👥 System Actors & Role Permissions

| Actor | Wallet Role | Permissions |
| :--- | :--- | :--- |
| **District Registrar** | `isRegistrar` | Register new parcels, assign cadastral numbers, issue genesis titles |
| **Cadastral Surveyor** | `isSurveyor` | Inspect physical plot boundaries, verify survey numbers & approve titles |
| **Legal Notary** | `isNotary` | Record mortgages, attach court stay liens, clear encumbrances, witness deeds |
| **Property Owner** | `msg.sender == owner` | View owned property, initiate on-chain title transfer to buyers |
| **Buyer / Public** | Public Reader | Search parcel history, verify title provenance, check document SHA-256 hash |

---

## 📊 Property Data Model

```solidity
struct Parcel {
    bytes32 parcelId;        // Unique identifier (e.g. keccak256("DIST/BLK/PLOT"))
    string propertyNumber;   // Physical CTS/Plot Number (e.g. "CTS-Baner-45/2B")
    string surveyNumber;     // Official Cadastral Survey Number
    string location;         // Physical city, state, postal code
    uint256 areaSqFt;        // Surface area in sq. ft.
    string propertyType;     // Residential, Commercial, Agricultural, Industrial
    string geoHash;          // Geohash coordinate reference
    string metadataURI;      // IPFS URI containing cadastral layout & documents
    string documentHash;     // Cryptographic SHA-256 hash of original deed
    bool exists;             // Existence guard flag
    bool verified;           // Authority verification flag
    PropertyStatus status;   // REGISTERED, VERIFIED, ENCUMBERED, TRANSFERRED
    uint256 registeredAt;    // Registration block timestamp
    uint256 lastTransferredAt; // Timestamp of latest mutation
}

struct Title {
    address owner;           // Ethereum wallet of the title holder
    uint256 registeredAt;    // Timestamp when title was minted
    bool active;             // Active state
    string deedURI;          // IPFS URI to conveyance deed
}
```

---

## 📋 Sample Demonstration Input

> *Note: All sample values below are fictional demonstration data.*

| Field | Sample Value | Description |
| :--- | :--- | :--- |
| **Parcel ID** | `PROP-MH-PUN-001` | Unique blockchain parcel identifier |
| **Property Number** | `CTS-Baner-45/2B` | Official municipal CTS/Plot number |
| **Survey Number** | `Survey 45, Hissa 2B` | Cadastral revenue land survey record |
| **Location** | `Baner High Street, Pune, MH 411045` | Physical municipal address |
| **Area** | `3600 sq.ft.` | Total registered plot area |
| **Property Type** | `COMMERCIAL` | Land category |
| **Document Hash** | `0xa4b19d85c8f42ef4f169f44efea6e866e4a2c5...` | SHA-256 hash of `property_001.json` |
| **Initial Owner** | `0x90F79bf6EB2c4f870365E785982E1f101E93b906` | Aarav Sharma (Owner A) |
| **Status** | `VERIFIED` | Officially verified by Surveyor |

---

## 🛠️ Technology Stack

- **Smart Contracts**: Solidity `^0.8.20`
- **Development & Testing**: Hardhat, Ethers.js, Chai
- **Frontend DApp**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Motion
- **Cryptographic Tools**: Web Crypto API (SHA-256), Keccak256
- **Storage Strategy**: IPFS (off-chain documents) + EVM (on-chain title states)

---

## 🚀 Installation & Local Execution (VS Code Ready)

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/your-username/Blockchain-Land-Registry-Property-Ownership.git
cd Blockchain-Land-Registry-Property-Ownership
npm install
```

### 2. Run Hardhat Smart Contract Unit Tests

```bash
npx hardhat test
```

### 3. Start Local Hardhat Node & Deploy

```bash
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost
```

### 4. Start Frontend Application

```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🖼️ Screenshots

Place demonstration screenshots in the `screenshots/` directory:
- `screenshots/01_public_explorer.png` — Public title search & provenance tree
- `screenshots/02_authority_portal.png` — Registrar parcel registration & survey verification
- `screenshots/03_owner_transfer.png` — Pre-flight validated ownership transfer
- `screenshots/04_document_hasher.png` — SHA-256 document hashing & tamper detection
- `screenshots/05_hardhat_tests.png` — Automated 16+ unit test execution

---

## 👨‍💻 Author

**Student Blockchain Developer**  
*Department of Computer Engineering & Information Technology*
