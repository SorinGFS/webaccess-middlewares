'use stict';
// geoip city database lookup
const geoip = require('geoip-lite');
// watch MaxMind Db updates and reload it on memory when done
geoip.startWatchingDataUpdate();
// set request localization details
const localization = (req, res, next) => {
    if (req.server.localization) {
        req.site.localization = geoip.lookup(req.ip);
    }
    next();
};

module.exports = localization;
