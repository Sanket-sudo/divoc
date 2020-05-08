const express = require('express');

// ObjectId
const ObjectId = require('mongoose').Types.ObjectId;

// Models
const Teacher = require('../../models/teacher');

// Globals
const Response = require('../../globals/response');
const Config = require('../../globals/config.json');

const router = express.Router();

router.post('/login',function (request, response) {
    // Prepare
    const query = {
        username: request.body.username
    };

    // Run
    console.log('Finding Teacher');
    Teacher.find(query, function (error, teacher) {
        if (error) {
            console.error(error);
            console.log('Error finding teacher');
            new Response(response, 400, null, null);
        } else {
            console.log('Teacher found');
            if (teacher[0].password === request.body.password) {
                let result = {
                    token: Config.private.jwt.key,
                    name: teacher[0].name
                }
                new Response(response, 200, null, result);
            } else {
                new Response(response, 401, null, null);
            }
        }
    });
});

module.exports.router = router;