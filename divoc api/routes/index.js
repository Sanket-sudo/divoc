const express = require('express');
const router = express.Router();

// Register
router.use('/register', require('./teacher/register').router)
router.use('/register', require('./teacher/login').router)

// Route
router.use('/route', require('./route/protection').router)

// Meeting
router.use('/meeting', require('./meeting/create').router)

// Student
router.use('/student', require('./student/login').router)

module.exports.router = router;