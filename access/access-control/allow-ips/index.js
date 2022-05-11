'use strict';
// firewall
const createError = require('http-errors');
// allow ips
const allowIps = (req, res, next) => {
    if (req.server.accessControl && req.server.accessControl.allowIps) {
        // check if request ip is included
        if (Array.isArray(req.server.accessControl.allowIps) && !req.server.accessControl.allowIps.includes(req.ip)) {
            return next(createError.Forbidden());
        }
    }
    next();
}

module.exports = allowIps;