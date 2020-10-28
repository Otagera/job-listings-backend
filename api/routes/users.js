let express = require('express');
let router = express.Router();

let userCtrl = require('../controllers/user');

router.route('/user/:userid').delete(userCtrl.userDelete);
router.route('/signup').post(userCtrl.userSignUp);
router.route('/login').post(userCtrl.userLogin);

module.exports = router;
