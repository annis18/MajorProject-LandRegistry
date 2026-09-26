import { ethers } from 'ethers';
// Import the ABI Hardhat generated during compilation
import LandRegistryArtifact from './artifacts/contracts/LandRegistry.sol/LandRegistry.json';

// Your newly deployed contract address
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export async function connectWeb3() {
    if (!window.ethereum) {
        throw new Error("MetaMask is not installed. Please install it to use the Land Registry.");
    }

    // Force MetaMask to switch to the Hardhat Local network (Chain ID: 31337)
    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x7a69' }], 
        });
    } catch (switchError) {
        console.error("Network switch failed. Please manually select Hardhat Local in MetaMask.");
    }

    // 1. Connect to MetaMask using Ethers v6
    const provider = new ethers.BrowserProvider(window.ethereum);
    
    // 2. Request user to connect their wallet
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    
    // 3. Bind the smart contract to React using the ABI and Signer
    const contract = new ethers.Contract(CONTRACT_ADDRESS, LandRegistryArtifact.abi, signer);
    
    return { contract, signer, address: await signer.getAddress() };
}