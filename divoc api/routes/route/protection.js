const express = require('express');

// Globals
const Response = require('../../globals/response');
const Config = require('../../globals/config.json');

const router = express.Router();

router.post('/protection',function (request, response) {
    if (request.body.token === Config.private.jwt.key) {
        new Response(response, 200, null, null);
    } else {
        new Response(response, 401, null, null);
    }
});

module.exports.router = router;