'use strict';
// parse http form data (if enabled ensure csrfProtection fit the change)
// http://expressjs.com/en/4x/api.html#router.route
const router = require('express').Router();
const multer = require('multer');
const crypto = require('crypto');
const createError = require('http-errors');
const allowContexts = require('../../access-control/allow-contexts');

const getFileOptions = (files, file) => files.filter((item) => item.fieldName === file.fieldname)[0];

const getPrefix = (req, prefixArgs) => {
    if (!(Array.isArray(prefixArgs) && prefixArgs.length)) return '';
    let result = '';
    prefixArgs.forEach((arg) => (result += req.server.fn.get(req, ...arg.split('.'))));
    return '/' + req.server.fn.crc32(result).toString(16) + req.server.fn.crc32(req.server.fn.reverseString(result)).toString(16);
};

const getFilePath = (file, pathArgs) => {
    if (!(Array.isArray(pathArgs) && pathArgs.length)) return '';
    let result = '';
    pathArgs.forEach((part) => {
        if (part === 'timestamp') result += '/' + Date.now();
        if (part === 'yyyy') result += '/' + new Date().getFullYear();
        if (part === 'MM') result += '/' + ('0' + new Date().getMonth()).slice(-2);
        if (part === 'dd') result += '/' + ('0' + new Date().getDate()).slice(-2);
        if (part === 'hh') result += '/' + ('0' + new Date().getHours()).slice(-2);
        if (part === 'originalName') result += '/' + file.originalname;
        if (part === 'md5') result += '/' + crypto.createHash('md5').update(file.originalname).digest('hex');
        if (part === 'fieldName') result += '/' + file.fieldname;
        if (part === 'extension') result += '/' + file.originalname.split('.').pop();
    });
    return result;
};

const getFileName = (file, nameArgs) => {
    if (!(Array.isArray(nameArgs) && nameArgs.length)) return crypto.randomBytes(64).toString('hex').substring(0, 24);
    function getTz(timeZoneOffset) {
        const tzSign = timeZoneOffset > 0 ? '-' : '+';
        const absTzInSeconds = Math.abs(timeZoneOffset * 60000);
        return tzSign + ('0' + new Date(absTzInSeconds).getUTCHours()).slice(-2) + '_' + ('0' + new Date(absTzInSeconds).getUTCMinutes()).slice(-2);
    }
    let result = '';
    nameArgs.forEach((part) => {
        if (part === 'timestamp') result += '-' + Date.now();
        if (part === 'dateIso') result += '-' + new Date().toISOString().replace(/-/g, '_').replace(/:/g, '_').replace('T', '-').replace('Z', '');
        if (part === 'yyyy') result += '-' + new Date().getFullYear();
        if (part === 'MM') result += '_' + ('0' + new Date().getMonth()).slice(-2);
        if (part === 'dd') result += '_' + ('0' + new Date().getDate()).slice(-2);
        if (part === 'hh') result += '-' + ('0' + new Date().getHours()).slice(-2);
        if (part === 'mm') result += '_' + ('0' + new Date().getMinutes()).slice(-2);
        if (part === 'ss') result += '_' + ('0' + new Date().getSeconds()).slice(-2);
        if (part === 'ms') result += '.' + ('00' + new Date().getMilliseconds()).slice(-3);
        if (part === 'tz') result += getTz(new Date().getTimezoneOffset());
        if (part === 'originalName') result += '-' + file.originalname;
        if (part === 'rand16') result += '-' + crypto.randomBytes(64).toString('hex').substring(0, 16);
        if (part === 'rand8') result += '-' + crypto.randomBytes(64).toString('hex').substring(0, 8);
        if (part === 'md5') result += '-' + crypto.createHash('md5').update(file.originalname).digest('hex');
        if (part === 'fieldName') result += '-' + file.fieldname;
        if (part === 'extension') result += '.' + file.originalname.split('.').pop();
    });
    return result.substring(1);
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const prefix = getPrefix(req, getFileOptions(req.server.parseFormData.files, file).prefixArgs);
        const path = getFilePath(file, getFileOptions(req.server.parseFormData.files, file).pathArgs);
        const dest = req.server.parseFormData.destination ? req.server.parseFormData.destination + prefix + path : 'uploads' + prefix + path;
        req.server.fs.mkdir(dest);
        cb(null, dest);
    },
    filename: function (req, file, cb) {
        cb(null, getFileName(file, getFileOptions(req.server.parseFormData.files, file).nameArgs));
    },
});

const fileFilter = (req, file, cb) => {
    const filter = getFileOptions(req.server.parseFormData.files, file).filter;
    if (Array.isArray(filter) && filter.length) {
        if (filter.includes(file.originalname.split('.').pop())) {
            cb(null, true);
        } else {
            cb(createError(415, { file }));
        }
    } else {
        cb(null, true);
    }
};

// memoryStorage not supported
const parseFormData = (req, res, next) => {
    if (req.server.parseFormData) {
        if (req.method !== 'POST') return next(createError(405));
        if (!(Array.isArray(req.server.parseFormData.files) && req.server.parseFormData.files.length)) return next(createError('Missing parseFormData.files in config.'));
        const limits = req.server.parseFormData.limits;
        const preservePath = req.server.parseFormData.preservePath;
        const upload = multer({ storage, fileFilter, limits, preservePath });
        const files = req.server.parseFormData.files.map((file) => {
            return { name: file.fieldName, maxCount: file.maxCount };
        });
        router.use(upload.fields(files), handleError, responder);
    }
    next();
};

const handleError = (err, req, res, next) => {
    if (err && ['LIMIT_FILE_SIZE', 'LIMIT_UNEXPECTED_FILE', 'LIMIT_FILE_COUNT', 'LIMIT_PART_COUNT', 'LIMIT_FIELD_KEY', 'LIMIT_FIELD_VALUE', 'LIMIT_FIELD_COUNT'].includes(err.code)) return next(createError(413, err));
    if (err) return next(err);
};

const responder = (req, res, next) => {
    if (req.server.parseFormData.next) return next();
    return res.status(201).json(req.files);
};

router.use(allowContexts, parseFormData);

module.exports = router;
