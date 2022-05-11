'use strict';
// method firewall
const createError = require('http-errors');
// allow methods
const allowMethods = (req, res, next) => {
    if (req.server.accessControl && req.server.accessControl.allowMethods) {
        // check if request method is included
        if (Array.isArray(req.server.accessControl.allowMethods) && !req.server.accessControl.allowMethods.includes(req.ip)) {
            return next(createError.MethodNotAllowed());
        }
    }
    next();
}

module.exports = allowMethods;