const { Router } = require('express')
const express = require('express')
const router = express.Router()

const usercontrol = require('../controllers/user')

router.post('/signup', usercontrol.signup)
router.post('/login', usercontrol.login)

module.exports = router