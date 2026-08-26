export const SOLIDITY_CONTRACT_CODE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title LandRegistry
 * @author Student Blockchain Developer
 * @notice Educational blockchain land registry for property registration, 
 *         role-based verification, encumbrance management, and tamper-evident ownership transfers.
 */
contract LandRegistry {
    // ==========================================
    // ROLES & ACCESS CONTROL
    // ==========================================
    address public immutable admin;
    mapping(address => bool) public isRegistrar;
    mapping(address => bool) public isSurveyor;
    mapping(address => bool) public isNotary;

    // ==========================================
    // DATA STRUCTS
    // ==========================================
    enum PropertyStatus {
        REGISTERED,
        VERIFIED,
        TRANSFER_PENDING,
        TRANSFERRED,
        ENCUMBERED,
        DISPUTED
    }

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
        PropertyStatus status;   // Current lifecycle status
        uint256 registeredAt;    // Registration block timestamp
        uint256 lastTransferredAt; // Timestamp of latest mutation
    }

    struct Title {
        address owner;           // Ethereum wallet of the current/historical owner
        uint256 registeredAt;    // Timestamp when this title record was minted
        bool active;             // Whether this title record is currently active
        string deedURI;          // IPFS URI to the signed deed/conveyance deed
    }

    struct Encumbrance {
        string kind;             // e.g. "MORTGAGE", "COURT_ORDER", "TAX_LIEN"
        address by;              // Address of the issuing bank / notary
        bool active;             // Active lien state
        string ref;              // Sanction order or court stay reference number
        uint256 createdAt;       // Timestamp when encumbrance was recorded
    }

    // ==========================================
    // STATE MAPPINGS
    // ==========================================
    mapping(bytes32 => Parcel) public parcels;
    mapping(bytes32 => Title) public currentTitle;
    mapping(bytes32 => Title[]) public titleHistory;
    mapping(bytes32 => Encumbrance[]) public encumbrances;
    mapping(address => bytes32[]) private ownerProperties;

    // ==========================================
    // EVENTS (AUDIT TRAIL LOGS)
    // ==========================================
    event ParcelRegistered(
        bytes32 indexed parcelId,
        string propertyNumber,
        string location,
        address indexed initialOwner,
        string documentHash,
        uint256 timestamp
    );

    event PropertyVerified(
        bytes32 indexed parcelId,
        address indexed verifier,
        uint256 timestamp
    );

    event TitleIssued(
        bytes32 indexed parcelId,
        address indexed owner,
        string deedURI,
        uint256 timestamp
    );

    event TitleTransferred(
        bytes32 indexed parcelId,
        address indexed previousOwner,
        address indexed newOwner,
        string deedURI,
        uint256 timestamp
    );

    event EncumbranceAdded(
        bytes32 indexed parcelId,
        string kind,
        address indexed by,
        string ref,
        uint256 timestamp
    );

    event EncumbranceReleased(
        bytes32 indexed parcelId,
        uint256 indexed index,
        address indexed releasedBy,
        uint256 timestamp
    );

    event PropertyStatusUpdated(
        bytes32 indexed parcelId,
        PropertyStatus newStatus,
        uint256 timestamp
    );

    // ==========================================
    // MODIFIERS
    // ==========================================
    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }

    modifier onlyRegistrarRole() {
        require(isRegistrar[msg.sender] || msg.sender == admin, "Not authorized registrar");
        _;
    }

    modifier onlySurveyorRole() {
        require(isSurveyor[msg.sender] || msg.sender == admin, "Not authorized surveyor");
        _;
    }

    modifier onlyNotaryRole() {
        require(isNotary[msg.sender] || msg.sender == admin, "Not authorized notary");
        _;
    }

    modifier onlyPropertyOwner(bytes32 _parcelId) {
        require(parcels[_parcelId].exists, "Parcel does not exist");
        require(currentTitle[_parcelId].owner == msg.sender, "Caller is not current owner");
        _;
    }

    // ==========================================
    // CONSTRUCTOR
    // ==========================================
    constructor(address _admin) {
        require(_admin != address(0), "Admin cannot be zero address");
        admin = _admin;
        isRegistrar[_admin] = true;
        isSurveyor[_admin] = true;
        isNotary[_admin] = true;
    }

    // ==========================================
    // ADMIN ROLE MANAGEMENT
    // ==========================================
    function setRegistrar(address _account, bool _val) external onlyAdmin {
        require(_account != address(0), "Invalid address");
        isRegistrar[_account] = _val;
    }

    function setSurveyor(address _account, bool _val) external onlyAdmin {
        require(_account != address(0), "Invalid address");
        isSurveyor[_account] = _val;
    }

    function setNotary(address _account, bool _val) external onlyAdmin {
        require(_account != address(0), "Invalid address");
        isNotary[_account] = _val;
    }

    // ==========================================
    // PROPERTY REGISTRATION
    // ==========================================
    function registerParcel(
        bytes32 _parcelId,
        string calldata _propertyNumber,
        string calldata _surveyNumber,
        string calldata _location,
        uint256 _areaSqFt,
        string calldata _propertyType,
        string calldata _geoHash,
        string calldata _metadataURI,
        string calldata _documentHash,
        address _initialOwner,
        string calldata _deedURI
    ) external onlyRegistrarRole {
        require(!parcels[_parcelId].exists, "Parcel ID already registered");
        require(_initialOwner != address(0), "Initial owner cannot be zero address");
        require(_areaSqFt > 0, "Property area must be greater than zero");
        require(bytes(_documentHash).length > 0, "Document hash required");

        parcels[_parcelId] = Parcel({
            parcelId: _parcelId,
            propertyNumber: _propertyNumber,
            surveyNumber: _surveyNumber,
            location: _location,
            areaSqFt: _areaSqFt,
            propertyType: _propertyType,
            geoHash: _geoHash,
            metadataURI: _metadataURI,
            documentHash: _documentHash,
            exists: true,
            verified: false,
            status: PropertyStatus.REGISTERED,
            registeredAt: block.timestamp,
            lastTransferredAt: block.timestamp
        });

        Title memory initialTitle = Title({
            owner: _initialOwner,
            registeredAt: block.timestamp,
            active: true,
            deedURI: _deedURI
        });

        currentTitle[_parcelId] = initialTitle;
        titleHistory[_parcelId].push(initialTitle);
        ownerProperties[_initialOwner].push(_parcelId);

        emit ParcelRegistered(
            _parcelId,
            _propertyNumber,
            _location,
            _initialOwner,
            _documentHash,
            block.timestamp
        );

        emit TitleIssued(_parcelId, _initialOwner, _deedURI, block.timestamp);
    }

    // ==========================================
    // PROPERTY VERIFICATION
    // ==========================================
    function verifyProperty(bytes32 _parcelId) external {
        require(isRegistrar[msg.sender] || isSurveyor[msg.sender] || msg.sender == admin, "Unauthorized verifier");
        require(parcels[_parcelId].exists, "Property does not exist");
        require(!parcels[_parcelId].verified, "Property already verified");

        parcels[_parcelId].verified = true;
        parcels[_parcelId].status = PropertyStatus.VERIFIED;

        emit PropertyVerified(_parcelId, msg.sender, block.timestamp);
        emit PropertyStatusUpdated(_parcelId, PropertyStatus.VERIFIED, block.timestamp);
    }

    // ==========================================
    // ENCUMBRANCE MANAGEMENT
    // ==========================================
    function addEncumbrance(
        bytes32 _parcelId,
        string calldata _kind,
        string calldata _ref
    ) external onlyNotaryRole {
        require(parcels[_parcelId].exists, "Parcel does not exist");

        encumbrances[_parcelId].push(Encumbrance({
            kind: _kind,
            by: msg.sender,
            active: true,
            ref: _ref,
            createdAt: block.timestamp
        }));

        parcels[_parcelId].status = PropertyStatus.ENCUMBERED;

        emit EncumbranceAdded(_parcelId, _kind, msg.sender, _ref, block.timestamp);
        emit PropertyStatusUpdated(_parcelId, PropertyStatus.ENCUMBERED, block.timestamp);
    }

    function releaseEncumbrance(
        bytes32 _parcelId,
        uint256 _index
    ) external onlyNotaryRole {
        require(parcels[_parcelId].exists, "Parcel does not exist");
        require(_index < encumbrances[_parcelId].length, "Encumbrance index out of bounds");
        require(encumbrances[_parcelId][_index].active, "Encumbrance already released");

        encumbrances[_parcelId][_index].active = false;
        emit EncumbranceReleased(_parcelId, _index, msg.sender, block.timestamp);

        if (!hasActiveEncumbrance(_parcelId)) {
            parcels[_parcelId].status = PropertyStatus.VERIFIED;
            emit PropertyStatusUpdated(_parcelId, PropertyStatus.VERIFIED, block.timestamp);
        }
    }

    function hasActiveEncumbrance(bytes32 _parcelId) public view returns (bool) {
        Encumbrance[] memory list = encumbrances[_parcelId];
        for (uint256 i = 0; i < list.length; i++) {
            if (list[i].active) {
                return true;
            }
        }
        return false;
    }

    // ==========================================
    // OWNERSHIP TRANSFER (MUTATION)
    // ==========================================
    function transferTitle(
        bytes32 _parcelId,
        address _to,
        string calldata _newDeedURI
    ) external {
        require(parcels[_parcelId].exists, "Parcel does not exist");
        require(parcels[_parcelId].verified, "Cannot transfer unverified property");
        require(!hasActiveEncumbrance(_parcelId), "Transfer blocked: Active mortgage/lien exists");
        require(_to != address(0), "New owner cannot be zero address");
        
        Title memory current = currentTitle[_parcelId];
        require(current.active, "No active title found");
        require(
            msg.sender == current.owner || isNotary[msg.sender] || msg.sender == admin,
            "Only current owner or authorized notary can execute transfer"
        );
        require(_to != current.owner, "Cannot transfer to existing owner");

        address previousOwner = current.owner;

        // Deactivate old title record
        currentTitle[_parcelId].active = false;

        // Issue new title record
        Title memory newTitle = Title({
            owner: _to,
            registeredAt: block.timestamp,
            active: true,
            deedURI: _newDeedURI
        });

        currentTitle[_parcelId] = newTitle;
        titleHistory[_parcelId].push(newTitle);
        ownerProperties[_to].push(_parcelId);

        parcels[_parcelId].lastTransferredAt = block.timestamp;
        parcels[_parcelId].status = PropertyStatus.TRANSFERRED;

        emit TitleTransferred(_parcelId, previousOwner, _to, _newDeedURI, block.timestamp);
        emit PropertyStatusUpdated(_parcelId, PropertyStatus.TRANSFERRED, block.timestamp);
    }

    // ==========================================
    // VIEW GETTERS
    // ==========================================
    function getParcel(bytes32 _parcelId) external view returns (Parcel memory) {
        require(parcels[_parcelId].exists, "Parcel does not exist");
        return parcels[_parcelId];
    }

    function getCurrentTitle(bytes32 _parcelId) external view returns (Title memory) {
        require(parcels[_parcelId].exists, "Parcel does not exist");
        return currentTitle[_parcelId];
    }

    function getTitleHistory(bytes32 _parcelId) external view returns (Title[] memory) {
        require(parcels[_parcelId].exists, "Parcel does not exist");
        return titleHistory[_parcelId];
    }

    function getEncumbrances(bytes32 _parcelId) external view returns (Encumbrance[] memory) {
        return encumbrances[_parcelId];
    }

    function getPropertiesByOwner(address _owner) external view returns (bytes32[] memory) {
        return ownerProperties[_owner];
    }

    function propertyExists(bytes32 _parcelId) external view returns (bool) {
        return parcels[_parcelId].exists;
    }
}`;

export const HARDHAT_TEST_CODE = `const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("LandRegistry Smart Contract Comprehensive Test Suite", function () {
  let LandRegistry;
  let lr;
  let admin, registrar, surveyor, notary, ownerA, buyerB, attacker;

  const PID_1 = ethers.keccak256(ethers.toUtf8Bytes("PROP-MH-PUN-001"));
  const PID_2 = ethers.keccak256(ethers.toUtf8Bytes("PROP-MH-PUN-002"));
  const DOC_HASH_1 = "0xa4b19d85c8f42ef4f169f44efea6e866e4a2c5957d07936a19f2be17dc3e0d84";

  beforeEach(async function () {
    [admin, registrar, surveyor, notary, ownerA, buyerB, attacker] = await ethers.getSigners();
    LandRegistry = await ethers.getContractFactory("LandRegistry");
    lr = await LandRegistry.deploy(admin.address);
    await lr.waitForDeployment();

    // Assign roles
    await lr.connect(admin).setRegistrar(registrar.address, true);
    await lr.connect(admin).setSurveyor(surveyor.address, true);
    await lr.connect(admin).setNotary(notary.address, true);
  });

  describe("1. Deployment & Role Governance", function () {
    it("Should deploy with correct admin and initial permissions", async function () {
      expect(await lr.admin()).to.equal(admin.address);
      expect(await lr.isRegistrar(registrar.address)).to.be.true;
      expect(await lr.isSurveyor(surveyor.address)).to.be.true;
      expect(await lr.isNotary(notary.address)).to.be.true;
    });

    it("Should reject non-admin from assigning roles", async function () {
      await expect(
        lr.connect(attacker).setRegistrar(attacker.address, true)
      ).to.be.revertedWith("Not admin");
    });
  });

  describe("2. Property Registration", function () {
    it("Should allow authorized Registrar to register a new parcel", async function () {
      await expect(
        lr.connect(registrar).registerParcel(
          PID_1,
          "CTS-Baner-45/2B",
          "Survey 45/2B",
          "Baner, Pune",
          3600,
          "COMMERCIAL",
          "tek3v2",
          "ipfs://metadata-001",
          DOC_HASH_1,
          ownerA.address,
          "ipfs://deed-001"
        )
      )
        .to.emit(lr, "ParcelRegistered")
        .withArgs(PID_1, "CTS-Baner-45/2B", "Baner, Pune", ownerA.address, DOC_HASH_1, (v) => true);

      const parcel = await lr.getParcel(PID_1);
      expect(parcel.exists).to.be.true;
      expect(parcel.verified).to.be.false;
      expect(parcel.areaSqFt).to.equal(3600);

      const title = await lr.getCurrentTitle(PID_1);
      expect(title.owner).to.equal(ownerA.address);
      expect(title.active).to.be.true;
    });

    it("Should reject duplicate property ID registration", async function () {
      await lr.connect(registrar).registerParcel(
        PID_1, "CTS-Baner-45/2B", "Survey 45/2B", "Baner, Pune", 3600, "COMMERCIAL",
        "tek3v2", "ipfs://meta", DOC_HASH_1, ownerA.address, "ipfs://deed"
      );

      await expect(
        lr.connect(registrar).registerParcel(
          PID_1, "CTS-Baner-45/2B", "Survey 45/2B", "Baner, Pune", 3600, "COMMERCIAL",
          "tek3v2", "ipfs://meta", DOC_HASH_1, ownerA.address, "ipfs://deed"
        )
      ).to.be.revertedWith("Parcel ID already registered");
    });

    it("Should reject registration with zero address owner", async function () {
      await expect(
        lr.connect(registrar).registerParcel(
          PID_1, "CTS-Baner-45/2B", "Survey 45/2B", "Baner, Pune", 3600, "COMMERCIAL",
          "tek3v2", "ipfs://meta", DOC_HASH_1, ethers.ZeroAddress, "ipfs://deed"
        )
      ).to.be.revertedWith("Initial owner cannot be zero address");
    });

    it("Should reject registration from unauthorized user", async function () {
      await expect(
        lr.connect(attacker).registerParcel(
          PID_1, "CTS-Baner-45/2B", "Survey 45/2B", "Baner, Pune", 3600, "COMMERCIAL",
          "tek3v2", "ipfs://meta", DOC_HASH_1, ownerA.address, "ipfs://deed"
        )
      ).to.be.revertedWith("Not authorized registrar");
    });
  });

  describe("3. Property Verification", function () {
    beforeEach(async function () {
      await lr.connect(registrar).registerParcel(
        PID_1, "CTS-Baner-45/2B", "Survey 45/2B", "Baner, Pune", 3600, "COMMERCIAL",
        "tek3v2", "ipfs://meta", DOC_HASH_1, ownerA.address, "ipfs://deed"
      );
    });

    it("Should allow surveyor to verify parcel", async function () {
      await expect(lr.connect(surveyor).verifyProperty(PID_1))
        .to.emit(lr, "PropertyVerified")
        .withArgs(PID_1, surveyor.address, (v) => true);

      const parcel = await lr.getParcel(PID_1);
      expect(parcel.verified).to.be.true;
    });

    it("Should reject unauthorized verification attempt", async function () {
      await expect(
        lr.connect(attacker).verifyProperty(PID_1)
      ).to.be.revertedWith("Unauthorized verifier");
    });

    it("Should reject verification if already verified", async function () {
      await lr.connect(surveyor).verifyProperty(PID_1);
      await expect(
        lr.connect(surveyor).verifyProperty(PID_1)
      ).to.be.revertedWith("Property already verified");
    });
  });

  describe("4. Encumbrances & Liens", function () {
    beforeEach(async function () {
      await lr.connect(registrar).registerParcel(
        PID_1, "CTS-Baner-45/2B", "Survey 45/2B", "Baner, Pune", 3600, "COMMERCIAL",
        "tek3v2", "ipfs://meta", DOC_HASH_1, ownerA.address, "ipfs://deed"
      );
      await lr.connect(surveyor).verifyProperty(PID_1);
    });

    it("Should allow Notary to place and release bank mortgage lien", async function () {
      await lr.connect(notary).addEncumbrance(PID_1, "MORTGAGE", "BANK-SANCTION-REF-901");
      expect(await lr.hasActiveEncumbrance(PID_1)).to.be.true;

      // Transfer should be blocked while encumbered
      await expect(
        lr.connect(ownerA).transferTitle(PID_1, buyerB.address, "ipfs://deed-new")
      ).to.be.revertedWith("Transfer blocked: Active mortgage/lien exists");

      // Release lien
      await lr.connect(notary).releaseEncumbrance(PID_1, 0);
      expect(await lr.hasActiveEncumbrance(PID_1)).to.be.false;

      // Transfer should now succeed
      await expect(
        lr.connect(ownerA).transferTitle(PID_1, buyerB.address, "ipfs://deed-new")
      ).to.emit(lr, "TitleTransferred");
    });
  });

  describe("5. Ownership Mutation & History", function () {
    beforeEach(async function () {
      await lr.connect(registrar).registerParcel(
        PID_1, "CTS-Baner-45/2B", "Survey 45/2B", "Baner, Pune", 3600, "COMMERCIAL",
        "tek3v2", "ipfs://meta", DOC_HASH_1, ownerA.address, "ipfs://deed"
      );
      await lr.connect(surveyor).verifyProperty(PID_1);
    });

    it("Should successfully transfer ownership and preserve history trail", async function () {
      await lr.connect(ownerA).transferTitle(PID_1, buyerB.address, "ipfs://deed-to-buyer");
      
      const newTitle = await lr.getCurrentTitle(PID_1);
      expect(newTitle.owner).to.equal(buyerB.address);

      const history = await lr.getTitleHistory(PID_1);
      expect(history.length).to.equal(2);
      expect(history[0].owner).to.equal(ownerA.address);
      expect(history[0].active).to.be.false;
      expect(history[1].owner).to.equal(buyerB.address);
      expect(history[1].active).to.be.true;
    });

    it("Should prevent old owner from transferring again", async function () {
      await lr.connect(ownerA).transferTitle(PID_1, buyerB.address, "ipfs://deed-to-buyer");
      
      await expect(
        lr.connect(ownerA).transferTitle(PID_1, attacker.address, "ipfs://fraud-deed")
      ).to.be.revertedWith("Only current owner or authorized notary can execute transfer");
    });

    it("Should reject transfer to zero address", async function () {
      await expect(
        lr.connect(ownerA).transferTitle(PID_1, ethers.ZeroAddress, "ipfs://deed")
      ).to.be.revertedWith("New owner cannot be zero address");
    });
  });
});`;

export const HARDHAT_DEPLOY_SCRIPT = `const hre = require("hardhat");

async function main() {
  console.log("Starting LandRegistry contract deployment...");

  const [admin, registrar, surveyor, notary, ownerA] = await hre.ethers.getSigners();
  console.log("Deploying contract with Admin account:", admin.address);

  const LandRegistry = await hre.ethers.getContractFactory("LandRegistry");
  const landRegistry = await LandRegistry.deploy(admin.address);
  await landRegistry.waitForDeployment();

  const contractAddress = await landRegistry.getAddress();
  console.log("✓ LandRegistry deployed successfully at:", contractAddress);

  console.log("Configuring role permissions...");
  await (await landRegistry.setRegistrar(registrar.address, true)).wait();
  await (await landRegistry.setSurveyor(surveyor.address, true)).wait();
  await (await landRegistry.setNotary(notary.address, true)).wait();
  console.log("✓ Roles assigned: Registrar, Surveyor, Notary");

  console.log("Registering initial genesis parcel...");
  const pid = hre.ethers.keccak256(hre.ethers.toUtf8Bytes("PROP-MH-PUN-001"));
  const docHash = "0xa4b19d85c8f42ef4f169f44efea6e866e4a2c5957d07936a19f2be17dc3e0d84";

  await (await landRegistry.connect(registrar).registerParcel(
    pid,
    "CTS-Baner-45/2B",
    "Survey 45, Hissa 2B",
    "Baner High Street, Pune, Maharashtra",
    3600,
    "COMMERCIAL",
    "tek3v28uq1",
    "ipfs://bafybeicg2vqyvxk6j4x77z7o27m3g4vsmf4a2z3u5v7",
    docHash,
    ownerA.address,
    "ipfs://initial-deed-aarav-sharma"
  )).wait();

  console.log("✓ Genesis parcel registered for Owner:", ownerA.address);
  console.log("Deployment complete! All systems operational.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});`;

export const HARDHAT_CONFIG_JS = `require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "https://rpc.sepolia.org",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
};`;
