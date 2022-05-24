'use strict';


class Certificate {
    /**
     * constructor for the certificate transaction object. This will be written to the blockchain ledger for each
     * certificate issued. 
     *  
     * @param {String} certHash - Hash created from the certificate data. 
     * @param {String} doctorSignature - Signature of @certHash signed by private key of issuer(doctor)
     * @param {String} patientSignature - Signature of @certHash signed by private key of holder(patient)
     * @param {String} dateOfIssuing - Date the certificate was issued
     * @param {String} certUUID - UUID for a certificate (automatically generated. Must match with database entry)
     * @param {String} doctorPK - Public key or public ID of issuer account
     * @param {String} patientPK - Public key or public ID of patient account 
     */

     //todo: doctorPK and patientPK should ideally be public keys. If you can't accomplish this, look into using 
     // some kind of UUID instead. 
    constructor(certHash, doctorSignature, patientSignature, dateOfIssuing, certUUID, doctorPK, patientPK) {
        this.certHash = certHash;
        this.doctorPK = doctorPK;
        this.patientPK = patientPK;
        this.doctorSignature = doctorSignature;
        this.patientSignature = patientSignature;
        this.dateOfIssuing = dateOfIssuing;
        this.certUUID = certUUID;
        this.dataType = "certificate"
    }

   

    /**
     * Instantiate object from json argument. 
     * @param {json} data json data of a Product instance 
     * @returns {Certificate} instantiated Certificate object. 
     */

    static deserialize(data) {
        return new Certificate(data.certHash, data.doctorSignature, data.patientSignature, data.dateOfIssuing, data.certUUID, data.doctorPK, data.patientPK);
    }
    

}

module.exports = Certificate;
