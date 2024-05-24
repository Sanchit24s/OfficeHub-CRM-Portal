const express = require('express');
const router = express.Router();

const { findAll, findOne, findTodayAttendance, findToday, findAttendanceInRange } = require('../controllers/attendance');

router.get('/', findAll);
router.post('/range/:id', findAttendanceInRange);
router.get('/today', findToday);
router.get('/:id', findOne);
router.get('/today/:id', findTodayAttendance);


module.exports = router;