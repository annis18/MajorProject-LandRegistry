# Blockchain-Based Land Registry & Property Ownership System

An educational, tamper-evident blockchain land registry prototype using Solidity smart contracts for property parcel registration, role-based cadastral verification, mortgage encumbrance management, document SHA-256 hash verification, and auditable on-chain title mutation history.

**A 4th-Year B.Tech Major Project by students of Axis Institute of Technology and Management, Kanpur.**

---

## 👨‍💻 Project Team & Roles

| Team Member | System Role | Responsibilities |
| :--- | :--- | :--- |
| **Animesh Singh Chauhan** | **District Registrar (Admin)** | System administrator. Registers new property parcels and issues genesis titles. |
| **Harsh** | **Cadastral Surveyor** | Inspects physical plot boundaries and approves on-chain title verification. |
| **Divyanshh** | **Bank & Legal Notary** | Records bank loan mortgages, locks titles, and clears encumbrances. |
| **Ayushhh** | **Property Owner (Seller)** | Holds verified land titles and initiates secure on-chain ownership transfers. |
| **Kartikey** | **Citizen (Buyer)** | Searches parcel history, verifies title provenance, and receives transferred titles. |

---

## 📌 Overview

Traditional land registry systems rely on physical paper records or centralized databases that are susceptible to fraudulent alteration, double-selling, and slow verification delays. 

**LandChain** models an immutable, role-gated property registry powered by Ethereum smart contracts. Real estate deeds remain off-chain (IPFS) for privacy and gas efficiency, while cryptographic SHA-256 digests and title ownership states are immutably anchored on the blockchain.

---

## 🎯 Objectives

1. **Tamper-Evident Records**: Prevent unauthorized changes to land records through cryptographic immutability.
2. **Eliminate Double-Selling**: Smart contracts enforce that only the current verified owner can initiate a title transfer.
3. **Transparent Encumbrances**: Enable banks and legal notaries to flag active loans that lock property transfers on-chain.
4. **Instant Title Provenance**: Allow buyers to verify 100% of the historical ownership chain in seconds.
5. **Document Integrity**: Detect any modification to original property deeds through off-chain SHA-256 hash validation.

---

## 🔄 System Architecture & Workflow

```text
[ DISTRICT REGISTRAR ] ──> registerParcel() ──> Status: REGISTERED (unverified)
                                 │
[ CADASTRAL SURVEYOR ] ──> verifyProperty() ──> Status: VERIFIED (ready for trade)
                                 │
[ BANK / LEGAL NOTARY] ──> addEncumbrance() ──> Status: ENCUMBERED (transfers locked)
                                 │
[ BANK / LEGAL NOTARY] ──> releaseEncumbrance() ──> Status: VERIFIED (unlocked)
                                 │
[ VERIFIED OWNER     ] ──> transferOwnership() ──> New Title Issued + History Preserved