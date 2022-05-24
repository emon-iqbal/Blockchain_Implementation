const logger = require('../services/logger');

function authenticateLogin (req, res, next) {
    try {
        if (req.session.user_type === "patient") next();
        else throw new Error("Unauthorized access: Login first");
    } catch (e) {
        next(e);
    }
}

function redirectToDashboardIfLoggedIn(req,res,next) {
    try {
        if (req.session.user_type === "patient") return res.redirect('/patient/dashboard');
        else next();
    } catch (e) {
        next(e);
    }
}

module.exports = {redirectToDashboardIfLoggedIn, authenticateLogin};
