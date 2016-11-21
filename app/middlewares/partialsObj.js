const router = require('express').Router();

// Middleware to inject data into res.locals.partials
router.use((req, res, next) => {
    if (!res.locals.partials) {
        res.locals.partials = {};
    }
    next();
});

module.exports = router;
