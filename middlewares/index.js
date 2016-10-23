const express = require('express');

const router = express.Router();

router.use(require('./partialsObj'));
router.use(require('./flashMessage'));

module.exports = router;
