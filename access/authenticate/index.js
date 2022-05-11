'use strict';
// https://expressjs.com/en/4x/api.html#express.router
const router = require('express').Router();
const performanceTimer = require('../../dev-tools/performance-timer');
const consoleLogger = require('../../dev-tools/console-logger');
// sets req authenticated if authorization header is present and valid
async function authenticate(req, res, next) {
    req.performer = 'authenticate';
    // for public routes the frontend should not use auth header to avoid this step
    if (req.server.auth && req.server.auth.mode && req.headers.authorization) {
        // reject if tries relogin
        if (/\/auth/.test(req.path)) return res.status(304).end();
        // extract authorization parts
        let authHeader = req.headers.authorization.split(' ');
        // reject if authentication type is not JWT
        if (authHeader[0] !== 'Bearer') return res.status(403).end();
        // try to set the authenticated, the built-in auth will throw an error for invalid token or expired permission
        try {
            // verify the token and set authenticated claims
            req.authenticated = req.server.auth.jwt.authenticate(req, authHeader[1]);
            // check if authenticated claims and permission recorded in db are in accordance with the required conditions
            if (req.authenticated) {
                // try to get access permission, if no error switch the token with the proxied host's token
                const permission = await req.server.auth.jwt.permission(req);
                // no check for expired upstream token, because there it will be checked anyway
                if (req.server.proxyPass) req.headers['Authorization'] = 'Bearer ' + permission.token;
                // use trusted provider user data on local project (not proxied routes)
                if ((!req.server.proxyPass || req.server.vhost) && req.server.auth.provider.trusted) req.site.user = permission.user;
            }
        } catch (error) {
            next(error);
        }
    }
    next();
}

router.use(consoleLogger, performanceTimer, authenticate);

module.exports = router;
