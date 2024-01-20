const express = require('express');
const router = express.Router();
const { login_get, login_post, signup_post, logout_get } = require('../controllers/authControllers');

router.get('/login', login_get)

router.post('/login', login_post)

router.post('/signup', signup_post)

router.get('/logout', logout_get);

module.exports = router;