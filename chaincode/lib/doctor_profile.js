'use strict';




class DoctorProfile {
   /**
    * Public profile of a doctor
    * @param {String} name 
    * @param {String} publicKey 
    * @param {String} location 
    * @param {String} description 
    */
    constructor(name, publicKey, location, description){
        this.name = name;
        this.publicKey = publicKey;
        this.location = location;
        this.description = description;
        this.dataType = "doctor"
    }

   

    /**
     * Instantiate object from json argument. 
     * @param {json} data json data of a Profile instance 
     */

    static deserialize(data) {
        return new DoctorProfile(data.name, data.publicKey, data.location, data.description);
    }
}

module.exports = DoctorProfile;
