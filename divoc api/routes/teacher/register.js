const express = require('express');

// ObjectId
const ObjectId = require('mongoose').Types.ObjectId;

// Models
const Teacher = require('../../models/teacher');

// Globals
const Response = require('../../globals/response');

const router = express.Router();

router.post('/teacher',function (request, response) {
    // Prepare
    const teacher = new Teacher({
        _id: new ObjectId(),
        name: request.body.name,
        username: request.body.username,
        password: request.body.password
    });

    // Run
    console.log(`Creating teacher ${request.body.name}`);
    Teacher(teacher).save().then((teacher) => {
        console.log('Teacher created');
        new Response(response, 200, null, teacher);
    }).catch((error) => {
        console.error(error);
        new Response(response, 400, null, null);
    });
});

module.exports.router = router;