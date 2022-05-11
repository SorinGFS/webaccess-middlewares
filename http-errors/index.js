'use strict';
// this is a custom handler for errors created with http-errors plus internal errors
const handleError = async (err, req, res, next) => {
    const { statusCode = 500, expose, message, stack, headers, ...rest } = err;
    // log server errors (app errors are NOT logged into db, you may implement your own solution here)
    if (req.server && req.server.errorLogs) {
        // cancel access log to avoid redundant info for the same request
        req.removeAllListeners('end');
        const log = {};
        if (Array.isArray(req.server.errorLogs)) {
            req.server.errorLogs.forEach((item) => (log[item] = req[item]));
            await req.accessDb.controller('errors').insertOne({ time: new Date(), app: process.env.APP_NAME, message: message, ...log });
        } else {
            await req.accessDb.controller('errors').insertOne({ time: new Date(), app: process.env.APP_NAME, message: message, ip: req.ip, ips: req.ips, method: req.method, protocol: req.protocol, hostname: req.hostname, url: req.url });
        }
    }
    if (headers) res.set(headers);
    if (!expose && message && process.env.NODE_ENV === 'development') console.log(message, stack);
    if (!expose) return res.status(statusCode).end();
    return res.status(statusCode).json({ statusCode, message, ...rest });
};

module.exports = handleError;