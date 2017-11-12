const jwt = require('jsonwebtoken')

const Users = require('../models/user')
const Conversations = require('../models/conversation')

exports.load_chat_data = (req, res) => {
    Users.find({}, 'username _id', (err, users) => {
        console.log(req.body)
        if(err) {
            res.send({
                status: "error"
            })
        }
        else {
            res.send({
                status: "success",
                users: users
            })
        }
    })
}