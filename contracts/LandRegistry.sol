// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract LandRegistry {
    // Stores the address of the person deploying the contract (The Registrar/Gov)
    address public governmentAdmin;

    // The different stages a property can be in
    enum PropertyStatus { Pending, Verified, Encumbered, Transferred }

    // Blueprint for a property record
    struct Property {
        string propertyId;
        string location;
        uint256 area;
        address currentOwner;
        string documentHash; // This will hold our IPFS CID (The secure document)
        PropertyStatus status;
    }

    // A dictionary mapping a unique Property ID to its Property details
    mapping(string => Property) public properties;
    mapping(string => bool) public propertyExists;

    // Events to notify the React frontend when something happens on-chain
    event PropertyRegistered(string propertyId, address owner, string documentHash);
    event PropertyVerified(string propertyId);
    event OwnershipTransferred(string propertyId, address oldOwner, address newOwner);
    event EncumbranceAdded(string propertyId);

    // Security: Only the Government Admin can run functions with this modifier
    modifier onlyAdmin() {
        require(msg.sender == governmentAdmin, "Access Denied: Only Government Admin");
        _;
    }

    // Security: Only the actual owner can run functions with this modifier
    modifier onlyOwner(string memory _propertyId) {
        require(msg.sender == properties[_propertyId].currentOwner, "Access Denied: Not the owner");
        _;
    }

    // Runs once when the contract is deployed
    constructor() {
        governmentAdmin = msg.sender;
    }

    // 1. Government registers a new property
    function registerProperty(
        string memory _propertyId,
        string memory _location,
        uint256 _area,
        address _owner,
        string memory _documentHash
    ) public onlyAdmin {
        require(!propertyExists[_propertyId], "Error: Property ID already exists");

        properties[_propertyId] = Property({
            propertyId: _propertyId,
            location: _location,
            area: _area,
            currentOwner: _owner,
            documentHash: _documentHash,
            status: PropertyStatus.Pending
        });
        propertyExists[_propertyId] = true;

        emit PropertyRegistered(_propertyId, _owner, _documentHash);
    }

    // 2. Surveyor verifies the property details
    function verifyProperty(string memory _propertyId) public onlyAdmin {
        require(propertyExists[_propertyId], "Error: Property does not exist");
        properties[_propertyId].status = PropertyStatus.Verified;
        emit PropertyVerified(_propertyId);
    }

    // 3. Notary/Bank adds a loan or legal dispute (freezes transfer)
    function addEncumbrance(string memory _propertyId) public onlyAdmin {
        require(propertyExists[_propertyId], "Error: Property does not exist");
        properties[_propertyId].status = PropertyStatus.Encumbered;
        emit EncumbranceAdded(_propertyId);
    }

    // 4. Owner transfers property to a buyer
    function transferOwnership(string memory _propertyId, address _newOwner) public onlyOwner(_propertyId) {
        require(propertyExists[_propertyId], "Error: Property does not exist");
        // Crucial security check: Property cannot have a loan/dispute and must be verified
        require(properties[_propertyId].status == PropertyStatus.Verified, "Error: Property must be verified and free of encumbrances to transfer");
        
        address oldOwner = properties[_propertyId].currentOwner;
        properties[_propertyId].currentOwner = _newOwner;
        properties[_propertyId].status = PropertyStatus.Transferred;

        emit OwnershipTransferred(_propertyId, oldOwner, _newOwner);
    }

    // 5. Public search function (Read-only, costs zero gas)
    function getProperty(string memory _propertyId) public view returns (
        string memory location,
        uint256 area,
        address owner,
        string memory documentHash,
        PropertyStatus status
    ) {
        require(propertyExists[_propertyId], "Error: Property not found");
        Property memory p = properties[_propertyId];
        return (p.location, p.area, p.currentOwner, p.documentHash, p.status);
    }
}