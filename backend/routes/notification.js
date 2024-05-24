const express = require('express');
const router = express.Router();
const { findAll, markAllAsViewed, findByEmpId, markAllAsViewedByEmpId } = require('../controllers/notification');

router.get('/', findAll);
router.get('/:id', findByEmpId)
router.put('/markAllAsViewed', markAllAsViewed);
router.put('/markAllAsViewed/:id', markAllAsViewedByEmpId);

module.exports = router;