const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer({ storage: multer.diskStorage({
		destination: (req, file, cb) => {
			cb(null, "tmp/")
		},
		filename: (req, file, cb) => {
			cb(null, 'avatar-' + Date.now())
		}
	}) 
})

const account_controller = require('../controllers/account_controller')

module.exports = () => {
	router.post('/register', upload.single('avatar'), account_controller.user_register)

	router.post('/login', account_controller.user_login)

	router.get('/user', account_controller.get_user)

	return router;
}