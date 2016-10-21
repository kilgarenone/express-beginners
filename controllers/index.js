const express = require('express');

const router = express.Router();

router.use('/shops', require('./shops'));
router.use('/fav/', require('./favShops'));

module.exports = router;
