const router = require('express').Router();

const UserController = require('../app/controllers/userController');
const LoginController = require('../app/controllers/login');
const Authentication = require('../app/middleware/authentication');

router.post('/register', UserController.createUser);
router.post('/login', LoginController.login);

router.get('/checkusername', UserController.checkUsername);

router.use(Authentication);

router.get('/test', (req, res)=> {
	res.send('got it');
});

module.exports = router;
