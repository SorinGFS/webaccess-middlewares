'use strict';
// context based access control
const createError = require('http-errors');
// allow contexts
const allowContexts = (req, res, next) => {
    if (req.server.accessControl && req.server.accessControl.allowContexts) {
        return req.server.fn.hasInExactContextsMatches(req, req.server.accessControl.allowContexts) ? next() : next(createError.Forbidden());
    }
    next();
}

module.exports = allowContexts;