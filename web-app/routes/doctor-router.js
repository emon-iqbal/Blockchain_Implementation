const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctor-controller');
const doctorMiddleware = require('../middleware/doctor-middleware');

let title = "Doctor Profile";
let root = "doctor";


router.get('/register', function(req, res, next) {
    res.render('register-doctor', {   title, root,
        logInType: req.session.user_type || "none"
    });
});

router.get('/login',doctorMiddleware.redirectToDashboardIfLoggedIn, function (req,res,next) {
    res.render('login-doctor',  {   title, root,
        logInType: req.session.user_type || "none"
    })
});

router.get('/dashboard', doctorMiddleware.authenticateLogin, doctorController.getDashboard);

router.get('/issue', doctorMiddleware.authenticateLogin, function (req,res,next) {
    res.render('issue-doctor',  {   title, root,
        logInType: req.session.user_type || "none"
    })
});

router.post("/issue", doctorController.postIssueCertificate);


router.post('/register/submit', doctorController.postRegisterDoctor);

router.post('/login/submit', doctorController.postLoginDoctor);

router.get('/logout', doctorController.logOutAndRedirect);

module.exports = router;
