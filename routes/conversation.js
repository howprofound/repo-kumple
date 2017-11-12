const express = require('express')
const router = express.Router()

const conversation_controller = require('../controllers/conversation_controller')

module.exports = () => {
	router.get('/conversation', conversation_controller.conversation_create)

    router.get('/conversation/history', conversation_controller.conversation_history)

	return router;
}