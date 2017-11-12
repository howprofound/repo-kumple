const jwt = require('jsonwebtoken')

const Users = require('../models/user')
const Conversations = require('../models/conversation')

exports.load_chat_data = (req, res) => {
    jwt.verify(req.headers.authorization, 'supersecretsecret', (err, decoded) => {
        if(err) {
            res.send({
                status: "error"
            })
        }
        else {
            Users.find({_id: { $ne: decoded._id }}, 'username _id', (err, users) => {
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
    })
    
}