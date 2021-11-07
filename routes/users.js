const router = require('express').Router();
const { updateUser, getCurrentUser } = require('../controllers/users');
const { validateGetCurrentUser } = require('../middlewares/validations');

router.get('/me', getCurrentUser);

router.patch('/me', validateGetCurrentUser, updateUser);

module.exports = router;
