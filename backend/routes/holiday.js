const express = require('express');
const router = express.Router();

const { add, findAll, findById, update, deleteHoliday, findAllUpcomingHolidays } = require('../controllers/holiday');

router.get('/', findAll);
router.get('/upcomingHolidays', findAllUpcomingHolidays);
router.get('/:id',  findById);
router.post('/add', add);
router.patch('/update/:id', update);
router.delete('/delete/:id', deleteHoliday);

module.exports = router;