require('babel-register');
require('babel-polyfill');
require('dotenv').config();

module.exports = {


  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
   
  },
  contracts_directory: './src/contracts/',
  constracts_build_directory: './src/abis/',
  
  // Set default mocha options here, use special reporters etc.
  // Configure your compilers
  compilers: {
    solc: {
      version: "^0.6.0",
      optimizer: {
        enabled: true, 
        runs: 200
      }
    },
  },
};
