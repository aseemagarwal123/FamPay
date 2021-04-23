/* eslint-disable linebreak-style */
const router = require('express').Router();
const videoRoute = require('./routes/videoRoute');
router.use('/v1/video', videoRoute);

module.exports = router;
