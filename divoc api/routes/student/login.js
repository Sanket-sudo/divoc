const express = require('express');

// Models
const Meeting = require('../../models/meeting');

// Globals
const Response = require('../../globals/response');
const Config = require('../../globals/config.json');

const router = express.Router();

router.post('/login',function (request, response) {
    // Prepare
    const query = {
        meeting: request.body.meeting
    };

    // Run
    console.log('Finding Meeting');
    Meeting.find(query, function (error, meeting) {
        if (error) {
            console.error(error);
            console.log('Error finding meeting');
            new Response(response, 400, null, null);
        } else if(meeting.length == 0) {
            console.log('Meeting does not exists');
            new Response(response, 400, null, null);
        } else {
            console.log('Meeting found');
            if (meeting[0].password === request.body.password) {
                let result = {
                    hostId: meeting[0].meeting
                }
                new Response(response, 200, null, result);
            } else {
                new Response(response, 401, null, null);
            }
        }
    });
});

module.exports.router = router;