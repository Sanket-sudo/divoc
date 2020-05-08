const express = require('express');

// ObjectId
const ObjectId = require('mongoose').Types.ObjectId;

// Models
const Meeting = require('../../models/meeting');

// Globals
const Response = require('../../globals/response');

const router = express.Router();

router.post('/create',function (request, response) {
    let meeting_password = Math.floor(Math.random() * 1627492) + 1;

    console.log(request.body.id);
    // Prepare
    const meeting = new Meeting({
        _id: new ObjectId(),
        meeting: request.body.id,
        password: meeting_password
    });

    // Run
    console.log(`Creating meeting ${request.body.id}`);
    Meeting(meeting).save().then((meeting) => {
        console.log('Meeting created');
        new Response(response, 200, null, meeting);
    }).catch((error) => {
        console.error(error);
        new Response(response, 400, null, null);
    });
});

module.exports.router = router;