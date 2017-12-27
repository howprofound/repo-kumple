const express = require('express')
const router = express.Router()

const conversation_controller = require('../controllers/conversation_controller')

module.exports = () => {
    router.get('/history/:id', conversation_controller.conversation_history)

    router.get('/group_history/:id', conversation_controller.group_conversation_history)

	return router;
}
