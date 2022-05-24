//add configuration files
//initialize environment variables
//try to use the export from this file instead of touching process.env directly.

const path = require('path');
const env = process.env.NODE_ENV || 'development';
const MONGODB_URI_LOCAL = 'mongodb://localhost:27017/blockchaincertificate';
const PORT = 3000;
const LOG_LEVEL = 'info';
const EXPRESS_SESSION_SECRET = 'sdfadfddfgdfg3242efDFHI234'; 
const CCP_PATH = '/home/training/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json';
const FABRIC_CHANNEL_NAME = 'mychannel';
const FABRIC_CHAINCODE_NAME = 'ehr';
if (env === 'development') {
    process.env.MONGODB_URI = process.env.MONGODB_URI_LOCAL;  //in case of dev, connect to local URI.
    process.env.NODE_ENV = 'development';
}


module.exports = {
    mongodbURI: process.env.MONGODB_URI,
    port: process.env.PORT,
    logLevel: process.env.LOG_LEVEL || "info",
    expressSessionSecret: process.env.EXPRESS_SESSION_SECRET,


    fabric: {
        ccpPath: process.env.CCP_PATH,
        walletPath: require('path').resolve(__dirname, "..", "wallet"),
        channelName : process.env.FABRIC_CHANNEL_NAME,
        chaincodeName : process.env.FABRIC_CHAINCODE_NAME
    }
};




