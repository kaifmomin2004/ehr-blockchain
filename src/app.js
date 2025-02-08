import Web3 from 'web3';
import { create } from 'ipfs-http-client';
import EHRContract from '../build/contracts/EHR.json';

const ipfs = create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

async function connectBlockchain() {
    const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');
    const accounts = await web3.eth.requestAccounts();
    document.getElementById("account").innerText = accounts[0];
}

window.onload = connectBlockchain;