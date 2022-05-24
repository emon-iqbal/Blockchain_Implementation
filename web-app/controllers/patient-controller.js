let patients = require('../database/models/patients');
let fabricEnrollment  = require('../services/fabric/enrollment');
let chaincode = require('../services/fabric/chaincode');
let logger = require("../services/logger");
let patientService = require('../services/patient-service');

let title = "Patient Profile";
let root = "patient";


async function postRegisterPatient(req, res, next) {
    try {
        let keys = await fabricEnrollment.registerUser(req.body.email);

        let dbResponse = await patients.create({
            name : req.body.name,
            email: req.body.email,
            password: req.body.password,
            publicKey: keys.publicKey
        });


        res.render("register-success", { title, root,
            logInType: req.session.user_type || "none"});
    }
    catch (e) {
        logger.error(e);
        next(e);
    }
}

async function logOutAndRedirect (req, res, next) {
    req.session.destroy(function () {
        res.redirect('/');
    });
};


async function postLoginPatient (req,res,next) {
    try {
        let patientObject = await patients.validateByCredentials(req.body.email, req.body.password)

        req.session.user_id = patientObject._id;
        req.session.user_type = "patient";
        req.session.email = patientObject.email;
        req.session.name = patientObject.name;
        req.session.publicKey = patientObject.publicKey;

        return res.redirect("/patient/dashboard")
    } catch (e) {
        logger.error(e);
        next(e);
    }
}


async function getDashboard(req, res, next) {
    try {
        let certData = await patientService.getCertificateDataforDashboard(req.session.publicKey, req.session.email);
        res.render("dashboard-patient", { title, root, certData,
            logInType: req.session.user_type || "none"});

    } catch (e) {
        logger.error(e);
        next(e);
    }
}

module.exports = {postRegisterPatient, postLoginPatient, logOutAndRedirect, getDashboard};
