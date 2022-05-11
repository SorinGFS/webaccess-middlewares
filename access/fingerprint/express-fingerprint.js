'use strict';
// pasive fingerprinting uses req object to identify the request source
var Fingerprint = require('express-fingerprint');

// fastest (this is reccommended and may be the best choice with mobileDetect at least enabled)
const device = Fingerprint({
    parameters: [
        // Built-in options
        // Fingerprint.useragent,
        // Fingerprint.acceptHeaders,
        // Fingerprint.geoip,
        // Custom options
        function (next, req, res) {
            next(null, {
                ip: req.ip,
                ips: req.ips,
                hostname: req.hostname,
                device: req.site.device, // mobileDetect
            });
        },
    ],
});

// userAgent (this option is 100% reliable even without mobileDetect enabled)
const userAgent = Fingerprint({
    parameters: [
        // Built-in options
        // Fingerprint.useragent,
        // Fingerprint.acceptHeaders,
        // Fingerprint.geoip,
        // Custom options
        function (next, req, res) {
            next(null, {
                ua: req.headers['user-agent'],
                ip: req.ip,
                ips: req.ips,
                hostname: req.hostname,
                device: req.site.device, // mobileDetect
            });
        },
    ],
});

// strongest (requires localization enabled)
const geoip = Fingerprint({
    parameters: [
        // Built-in options
        // Fingerprint.useragent,
        // Fingerprint.acceptHeaders,
        // Fingerprint.geoip,
        // Custom options
        function (next, req, res) {
            next(null, {
                // ip: req.ip,
                // ips: req.ips,
                hostname: req.hostname,
                device: req.site.device, // mobileDetect
                localization: req.site.localization, // localization
            });
        },
    ],
});

const fingerprint = (profile) => {
    if (profile === 'device') {
        return device;
    } else if (profile === 'userAgent') {
        return userAgent;
    } else if (profile === 'geoip') {
        return geoip;
    }
};

module.exports = (profile) => fingerprint(profile);
