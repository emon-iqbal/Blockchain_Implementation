
const certificates = require('../database/models/certificates');
const patients = require('../database/models/patients');
const chaincode = require('./fabric/chaincode');
const logger = require("./logger");
const encryption = require('./encryption');
const certificateService = require('./certificate-service');




async function getCertificateDataforDashboard(patientPublicKey, patientEmail) {


    let certLedgerDataArray = await chaincode.invokeChaincode("getAllCertificateByPatient",
        [patientPublicKey], true, patientEmail);

    let certUUIDArray = certLedgerDataArray.map( element => {
        return element.certUUID
    });

    let certDBRecords = await certificates.find().where('_id').in(certUUIDArray).exec();

    return certificateService.mergeCertificateData(certDBRecords, certLedgerDataArray);
}


module.exports = {getCertificateDataforDashboard}
