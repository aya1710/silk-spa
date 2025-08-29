
const express = require('express');
const registerRoute = require('./register');
const loginRoute = require('./login');
const profileRoute = require('./profile'); 

const router = express.Router();


router.use('/register', registerRoute); 
router.use('/login', loginRoute);
router.use('/profile', profileRoute);   
module.exports = router;
