const mongoose = require('mongoose');
const validator = require('validator');


const certificateSchema = new mongoose.Schema({

    patientName: {
        type: String,
        required: true,
        trim: true,

    },
    patientEmail: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    doctorName: {
        type: String,
        required: true,
        trim: true,
    },
    doctorEmail: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    disease: {
        type: String,
        required: true,
        trim: true
    },
    departmentName: {
        type: String,
        required: true,
        trim: true
    },
    prescription: {
        type: String, 
        required: true,
        trim: true
        
    },
    dateOfIssuing: {
        type: Date,
        required: true
    },
});

certificateSchema.index({"patientEmail" : 1});
certificateSchema.index({"doctorEmail" : 1});

let certificates = mongoose.model("certificates", certificateSchema);
certificates.createIndexes();

module.exports = certificates;
