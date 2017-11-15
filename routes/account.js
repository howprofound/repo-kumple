const express = require('express')
const router = express.Router()

const account_controller = require('../controllers/account_controller')

module.exports = () => {
	router.post('/register', account_controller.user_register)

	router.post('/login', account_controller.user_login)

	router.get('/user', account_controller.get_user)

	return router;
}