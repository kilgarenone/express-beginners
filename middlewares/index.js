const express = require('express');

const router = express.Router();

router.use(require('./partialsObj'));
router.use(require('./flashMessage'));
router.use(require('./passport'));

module.exports = router;
