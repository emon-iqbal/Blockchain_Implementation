const moment = require('moment');


/**
 * Merge certificate data from Database and Blockchain Ledger
 * Runtime is O(N^2) which is kind of inefficient.
 * Time complexity shouldn't matter too much because N isn't going to grow very large
 * @param {certificates[]} dbRecordArray
 * @param ledgerRecordArray
 * @returns {certificates[]}
 */
function mergeCertificateData(dbRecordArray, ledgerRecordArray) {
    let certMergedDataArray = [];  //merge data from db and chaincode to create data for ejs view.

    for (let i = 0; i < dbRecordArray.length ; i++) {
        let dbEntry = dbRecordArray[i];
        let chaincodeEntry = ledgerRecordArray.find((element) => {
            return element.certUUID === dbEntry._id.toString();
        });

        certMergedDataArray.push({
            patientName : dbEntry.patientName,
            patientEmail : dbEntry.patientEmail,
            doctorName : dbEntry.doctorName,
            doctorEmail: dbEntry.doctorEmail,
            prescription : dbEntry.prescription,
            departmentName : dbEntry.departmentName,
            dateOfIssuing: moment(dbEntry.dateOfIssuing).format('YYYY-MM-DD'),
            disease: dbEntry.disease,
            certUUID: dbEntry._id.toString(),
            hash: chaincodeEntry.certHash

        })
    }

    return certMergedDataArray;
}

module.exports = {mergeCertificateData};
