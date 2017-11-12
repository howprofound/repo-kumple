const router = express.Router()

const chat_controller = require('../controllers/chat_controller')

module.exports = () => {
	router.get('/', chat_controller.load_chat_data)

	return router;
}