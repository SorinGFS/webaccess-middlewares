'use strict';
// https://expressjs.com/en/4x/api.html#express.router
const router = require('express').Router();

const firewall = require('./access-control/allow-ips');
const csrfProtection = require('./csrf-protection');
const setDevice = require('./mobile-detect');
const localization = require('./localization');
const fingerprint = require('./fingerprint');
const authenticate = require('./authenticate');
const spamProtection = require('./spam-protection');
const bodyParsers = require('./body-parsers');
const allowMethods = require('./access-control/allow-methods');
const accessLogs = require('./access-logs');

router.use(firewall, csrfProtection, setDevice, localization, fingerprint, authenticate, spamProtection, bodyParsers, allowMethods, accessLogs);

module.exports = router;
