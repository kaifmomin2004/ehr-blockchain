module.exports = {
    networks: {
        development: {
            host: "127.0.0.1", // Ganache
            port: 7545,
            network_id: "*",  // Match any network id
        },
        // Additional networks like Goerli or Sepolia can be added here
    },
    compilers: {
        solc: {
            version: "0.8.0" // Make sure it matches your contract version
        }
    }
};
