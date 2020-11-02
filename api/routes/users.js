let express = require('express');
let router = express.Router();

let userCtrl = require('../controllers/user');
const upload = require('../middlewares/multer');

router.route('/user/:userid').delete(userCtrl.userDelete);
router.route('/signup').post(upload.single(), userCtrl.userSignUp);
router.route('/login').post(upload.single(), userCtrl.userLogin);

module.exports = router;