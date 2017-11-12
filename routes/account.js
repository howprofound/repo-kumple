const router = express.Router()

const account_controller = require('../controllers/account_controller')

module.exports = () => {
	router.post('/register', account_controller.user_register)

	router.post('/login', account_controller.user_login)

	return router;
}