/*
  This index.js file is a place that consolidates
  and binds all the must-have middlewares.

  This index.js will in turn be called and binded to your app
  in app.js.
*/
const router = require('express').Router();

router.use(require('./partialsObj'));
router.use(require('./flashMessage'));
router.use(require('./passport'));

module.exports = router;
