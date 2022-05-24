'use strict';

const EHR = require('./lib/hoscert_contract');

console.log(EHR)
//NOTE: Estore was changed to Medicert.
//Todo: During chaincode invocation, each chaincode is given a name. Find out where that name originates from. 
module.exports.EHR = EHR;
module.exports.contracts = [ EHR ];
