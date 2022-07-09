'use strict';
// http://expressjs.com/en/4x/api.html#router.route
const router = require('express').Router();

const parseForm = require('./parse-form');
const parseFormData = require('./parse-form-data');
const parseJson = require('./parse-json');
const parseText = require('./parse-text');
const methodOverride = require('./method-override');
const dataAdapter = require('./data-adapter');

router.use(parseForm, parseFormData, parseJson, parseText, methodOverride, dataAdapter);

module.exports = router;
