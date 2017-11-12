const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const Users = require('../models/user')
const Conversations = require('../models/conversation')
const Messages = require('../models/message')

const chat_controller = require('../controllers/chat_controller')

module.exports = () => {
	router.get('/chat', chat_controller.)

	return router;
}