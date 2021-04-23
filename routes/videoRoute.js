const router = require('express').Router();
const {videoGetAll} = require('../controllers/videoController');
router.get('/fetch/getAll', videoGetAll);


module.exports = router;
