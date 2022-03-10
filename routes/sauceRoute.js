const express = require('express');
const router = express.Router();

const sauceCtrl = require('../controllers/sauceController');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer');
const like = require('../controllers/like');

router.get('/', auth, sauceCtrl.getAllSauces);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.post('/', auth, multer, sauceCtrl.createSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.post('/:id/like', auth, like.sauceLike);

module.exports = router;
