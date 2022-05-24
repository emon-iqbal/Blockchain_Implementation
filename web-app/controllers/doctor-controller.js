let doctors = require('../database/models/doctors');
let fabricEnrollment  = require('../services/fabric/enrollment');
let chaincode = require('../services/fabric/chaincode');
let logger = require("../services/logger");
let doctorService = require("../services/doctor-service");


let title = "Doctor Profile";
let root = "doctor";


async function postRegisterDoctor(req, res, next) {
    try {
        let keys = await fabricEnrollment.registerUser(req.body.email);
        let location = req.body.location + `, ${req.body.country}`;

        let dbResponse = await doctors.create({
            name : req.body.name,
            email: req.body.email,
            description: req.body.description,
            location: location,
            password: req.body.password,
            publicKey: keys.publicKey
        });

        let result = await chaincode.invokeChaincode("registerDoctor",
            [ req.body.name, keys.publicKey, location, req.body.description], false, req.body.email);
        logger.debug(`Doctor Registered. Ledger profile: ${result}`);

        res.render("register-success", { title, root,
            logInType: req.session.user_type || "none"});
    }
    catch (e) {
        logger.error(e);
        next(e);
    }
}

async function postLoginDoctor (req,res,next) {
    try {
        let doctorObject = await doctors.validateByCredentials(req.body.email, req.body.password)
        req.session.user_id = doctorObject._id;
        req.session.user_type = "doctor";
        req.session.email = doctorObject.email;
        req.session.name = doctorObject.name;

        return res.redirect("/doctor/issue")
    } catch (e) {
        logger.error(e);
        next(e);
    }
}

async function logOutAndRedirect (req, res, next) {
    req.session.destroy(function () {
        res.redirect('/');
    });
}

async function postIssueCertificate(req,res,next) {
    try {
        let certData = {
            patientEmail: req.body.patientEmail,
            patientName: req.body.patientName,
            doctorName: req.session.name,
            doctorEmail: req.session.email,
            disease: req.body.disease,
            departmentName:  req.body.department,
            prescription: req.body.prescription,
            dateOfIssuing: req.body.date,
        };

        let serviceResponse = await doctorService.issueCertificate(certData);

        if(serviceResponse) {
            res.render("issue-success", { title, root,
                logInType: req.session.user_type || "none"});
        }

    } catch (e) {
        logger.error(e);
        next(e);
    }
}

async function getDashboard(req, res, next) {
    try {
        let certData = await doctorService.getCertificateDataforDashboard(req.session.name, req.session.email);
        res.render("dashboard-doctor", { title, root, certData,
            logInType: req.session.user_type || "none"});

    } catch (e) {
        logger.error(e);
        next(e);
    }
}
module.exports = {postRegisterDoctor, postLoginDoctor, logOutAndRedirect, postIssueCertificate, getDashboard};
