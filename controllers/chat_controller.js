const jwt = require('jsonwebtoken')

const Users = require('../models/user')
const Conversations = require('../models/conversation')
const Messages = require('../models/message')

var connectedUsers = []

exports.load_chat_data = (req, res) => {
    jwt.verify(req.headers.authorization, 'supersecretsecret', (err, decoded) => {
        if(err) {
            res.send({
                status: "error"
            })
        }
        else {
            Users.find({_id: { $ne: decoded.id }}, 'username _id', (err, users) => {
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

exports.chat_connection = (id, socket) => {
    socket.emit('connected_users', connectedUsers)
    connectedUsers.push({
        id: id,
        socketId: socket.id
    })
    socket.broadcast.emit('user_change', {id: id, isActive: true})
}

exports.chat_disconnection = socket => {
    let dcUser
    connectedUsers = connectedUsers.filter(user => {
        if(user.socketId !== socket.id)
            return true
        else {
            dcUser = user.id
            return false
        }
    })
    socket.broadcast.emit('user_change', {id: dcUser, isActive: false})
    Users.findOneAndUpdate({
        _id: dcUser
    }, {
        $set: { lastLogin: Date.now() }
    }, err => {
        if(err) console.log(err)
    })
}

exports.new_message = (message, ack, socket) => {
    Messages.create({
        content: message.content,
        author: message.author,
        wasDelivered: true,
        wasSeen: false,
        conversationId: message.conversationId

    }, (err, messageInstance) => {
        if (err) {
            console.log("error")
        }
        else {
            let target = connectedUsers.find(user => user.id === message.addresse)
            if (target) {
                socket.broadcast.to(target.socketId).emit("new_message", messageInstance)
            }
            ack(messageInstance._id)
        }
    })
}

exports.message_seen = (message, socket) => {
    Messages.findOneAndUpdate({ _id: message.id }, { $set: { wasSeen: true } }, (err, message) => {
        if(err) {
            console.log("error")
        }
        else {
            let target = connectedUsers.find(user => user.id === message.author)
            if (targer) {
                socket.broadcast.to(targer.socketId).emit("message_seen", message._id)
            }
        }
    })
}