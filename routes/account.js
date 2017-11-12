const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const Users = require('../models/user')
const Conversations = require('../models/conversation')
const Messages = require('../models/message')

const account_controller = require('../controllers/account_controller')

module.exports = () => {
	router.post('/register', account_controller.user_register)

	router.post('/login', account_controller.user_login)

	return router;
}