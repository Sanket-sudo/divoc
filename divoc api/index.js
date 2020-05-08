// ExpressJS
const express = require('express');

// Mongoose API to connect to MongoDB
const mongoose = require('mongoose');

// Configuration
const Config = require('./globals/config.json');

// Create database connection 
mongoose.connect(Config.private.mongo.url, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
    .catch((error) => {
        console.log(error);
    });

// Connected
mongoose.connection.on('connected', function () {
    console.log(`Mongoose connected to ${Config.private.mongo.url}`);
});

// Disconnected
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose disconnected');
});

// If Node process ends, close Mongoose connection 
process.on('SIGINT', function () {
    mongoose.connection.close(function () {
        console.log('Mongoose default connection terminated due to app termination');
        process.exit(0);
    });
});

// Initialize
const app = express();
app.use(express.json());

// Middleware to enable CORS
const cors = require("cors");
app.use(cors());

// Routes
const routes = require('./routes/index');
app.use('/', routes.router);

// Binding app with server
const server = require('http').createServer(app)

// Binding io to server
const io = require('socket.io').listen(server);

let connections = {};
io.sockets.on('connection', function (socket) {
    connections[socket.id] = {};
    console.log('Connected')
    io.sockets.to(socket.id).emit('gotid', socket.id);

    socket.on('disconnect', function () {
        let id = socket.id;
        console.log('Disconnected')
        console.log(connections[id]);
        io.sockets.to(connections[id].hostId).emit('leftMeeting', connections[id]);
    });

    socket.on('requestLecture', function(student) {
        let id = student.socketId;
        connections[id].hostId = student.hostId;
        connections[id].socketId = student.socketId;
        io.sockets.to(student.hostId).emit('requestLectureServer', student);
    });

    socket.on('lecture', function(lecture) {
        io.sockets.to(lecture.student.socketId).emit('gotLecture', lecture);
    });

    socket.on('answerVideo', function(data) {
        console.log('Anser till server Video');
        io.sockets.to(data.student.hostId).emit('answerVideoServer', data);
    });

    socket.on('candidate', function(data) {
        io.sockets.to(data.id).emit('candidate', data);
    })

    socket.on('doubt', function(data) {
        io.sockets.to(data.hostId).emit('doubtServer', data);
    })

    socket.on('tabChanged', function(data) {
        io.sockets.to(data.hostId).emit('addTabCount', data);
    });

    socket.on('sendQuestion', function(data) {
        for(let i in connections) {
            if(connections[i].hostId == socket.id) {
                io.sockets.to(connections[i].socketId).emit('question', data);
            }
        }
    })
});

// Bind
let port = process.env.PORT || 8081
server.listen(port, () => {
    console.log(`${Config.app.name} : ${port}`);
});