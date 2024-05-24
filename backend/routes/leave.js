const express = require('express');
const router = express.Router();

const { findAll, findById, add, approve, reject } = require('../controllers/leaveApp');

router.get('/', findAll);
router.get('/:id', findById);
router.post('/add/:id', add);
router.put('/:id/approve',  approve);
router.put('/:id/reject', reject);

module.exports = router;