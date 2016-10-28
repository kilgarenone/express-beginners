const express = require('express');

const router = express.Router();

router.use('/shops', require('./shops'));
router.use('/fav', require('./favShops'));

// error handler
router.use((err, req, res, next) => {
    if (err.code !== 'EBADCSRFTOKEN') return next(err);

    // handle CSRF token errors here
    res.status(403);
    res.send('form tampered with');
});

module.exports = router;
