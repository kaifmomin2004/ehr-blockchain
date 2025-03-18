import Web3 from 'web3';
import { create } from 'ipfs-http-client';
import EHRContract from '../build/contracts/EHR.json';

let web3;
let contract;
let account;

// Create an IPFS instance
const ipfs = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https'
});

async function connectBlockchain() {
    // Modern dApp browsers
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
    }
    // Legacy dApp browsers
    else if (window.web3) {
        web3 = new Web3(window.web3.currentProvider);
    }
    // Fallback
    else {
        alert("No Ethereum browser detected. Consider installing MetaMask!");
        return;
    }

    // Fetch accounts
    const accounts = await web3.eth.getAccounts();
    account = accounts[0];
    document.getElementById("account").innerText = account;

    // Load contract
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = EHRContract.networks[networkId];
    contract = new web3.eth.Contract(
        EHRContract.abi,
        deployedNetwork && deployedNetwork.address
    );

    // Fetch existing records
    fetchRecords();
}

window.onload = connectBlockchain;

export async function uploadRecord() {
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select a file to upload.");
        return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
        // Upload file to IPFS
        const { path } = await ipfs.add(Buffer(reader.result));
        // Store the IPFS hash in the contract
        await contract.methods.addRecord(path).send({ from: account });
        alert("Record uploaded successfully!");
        fetchRecords();
    };
    reader.readAsArrayBuffer(file);
}

async function fetchRecords() {
    const records = await contract.methods.getRecords().call({ from: account });
    const list = document.getElementById("recordsList");
    list.innerHTML = "";

    records.forEach((record) => {
        const li = document.createElement("li");
        li.innerHTML = `<a href="https://ipfs.infura.io/ipfs/${record.ipfsHash}" target="_blank">View Record</a>`;
        list.appendChild(li);
    });
}
