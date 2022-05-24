const doctors = require('../database/models/doctors');
const certificates = require('../database/models/certificates');
const patients = require('../database/models/patients');
const chaincode = require('./fabric/chaincode');
const logger = require("./logger");
const encryption = require('./encryption');
const certificateService = require('./certificate-service');

/**
 * Create certificate object in database and ledger.
 * For ledger - data needs to be cryptographically signed by patient and doctor private key.
 * @param {certificates.schema} certData
 * @returns {Promise<{}>}
 */
async function issueCertificate(certData) {

    let doctorObj = await doctors.findOne({"email": certData.doctorEmail});
    let patientObj = await patients.findOne({"email": certData.patientEmail});

    if (!patientObj) throw new Error("Could not fetch patient profile. Provide valid patient email.");
    if (!doctorObj) throw new Error("Could not fetch doctor profile.");

    let certDBModel = new certificates(certData);

    let mTreeHash =  await encryption.generateMerkleRoot(certDBModel);
    let doctorSignature = await encryption.createDigitalSignature(mTreeHash, certData.doctorEmail);
    let patientSignature = await encryption.createDigitalSignature(mTreeHash, certData.patientEmail);

    let chaincodeResult = await chaincode.invokeChaincode("issueCertificate",
        [mTreeHash, doctorSignature, patientSignature, certData.dateOfIssuing, certDBModel._id, doctorObj.publicKey, patientObj.publicKey ], false, certData.doctorEmail);

    logger.debug(chaincodeResult);

    let res = await certDBModel.save();
    if(!res) throw new Error("Could not create certificate in the database");

    return true; //If no errors were thrown, everything completed successfully.
}

/**
 * Fetch and return all certificates issued by a specific doctor
 * @param {String} doctorName
 * @param {String} doctorEmail
 * @returns {Promise<certificates[]>}
 */
async function getCertificateDataforDashboard(doctorName, doctorEmail) {
    let doctorProfile = await chaincode.invokeChaincode("queryDoctorProfileByName",
        [doctorName], true, doctorEmail);

    let certLedgerDataArray = await chaincode.invokeChaincode("getAllCertificateByDoctor",
        [doctorProfile.publicKey], true, doctorEmail);

    let certUUIDArray = certLedgerDataArray.map( element => {
        return element.certUUID
    });

    let certDBRecords = await certificates.find().where('_id').in(certUUIDArray).exec();

    return certificateService.mergeCertificateData(certDBRecords, certLedgerDataArray);
}


module.exports = {issueCertificate,  getCertificateDataforDashboard};
