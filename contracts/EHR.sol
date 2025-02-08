// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EHR {
    struct Record { string ipfsHash; address owner; }
    mapping(address => Record[]) private records;
    // Add functions and modifiers here (see original guide)
}