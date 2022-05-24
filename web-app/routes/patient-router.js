const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patient-controller');
const patientMiddleware = require('../middleware/patient-middleware');
let title = "Patient Profile";
let root = "patient";

router.get('/dashboard', patientMiddleware.authenticateLogin, patientController.getDashboard);

router.get('/register', function(req, res, next) {
    res.render('register-patient', {   title, root,
        logInType: req.session.user_type || "none"
    });
});

router.get('/login',patientMiddleware.redirectToDashboardIfLoggedIn, function (req,res,next) {
    res.render('login-patient',  {   title, root,
        logInType: req.session.user_type || "none"
    })
});

router.get('/logout', patientController.logOutAndRedirect);

router.post('/register/submit', patientController.postRegisterPatient);

router.post('/login/submit', patientController.postLoginPatient);


module.exports = router;
