const Users = require('../models/user')
const Conversations = require('../models/conversation')
const Messages = require('../models/message')
const Groups = require('../models/group')
const GroupMessages = require('../models/group_message')

var connectedUsers = []

exports.load_chat_data = (req, res) => {
    Users.find({_id: { $ne: req.userID }}, 'username _id', (err, users) => {
        Groups.find({users: req.userID}, (err, groups) => {
            if(err) {
                res.send({
                    status: "error"
                })
            }
            else {
                res.send({
                    status: "success",
                    users: users,
                    groups: groups
                })
            }
        })
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

exports.message_seen = (data, socket) => {
    Messages.update({ conversationId: data.conversationId, wasSeen: false, author: data.author }, { $set: { wasSeen: true } }, { multi: true }, (err, messages) => {
        if(err) {
            console.log("error")
        }
        else {
            let target = connectedUsers.find(user => user.id === data.author)
            if (target) {
                socket.broadcast.to(target.socketId).emit("message_seen", data.conversationId)
            }
        }
    })
}

exports.new_group_message = (message, ack, socket) => {
    GroupMessages.create({
        content: message.content,
        author: message.author,
        wasDelivered: true,
        wasSeenBy: [],
        groupId: message.groupId

    }, (err, messageInstance) => {
        if (err) {
            console.log("error")
        }
        else {
            let target = connectedUsers.find(user => user.id === message.addresse) // to do
            if (target) {
                socket.broadcast.to(target.socketId).emit("new_group_message", messageInstance)
            }
            ack(messageInstance._id)
        }
    })
}

exports.group_message_seen = (data, socket) => {
    GroupMessages.update({ groupId: data.groupId, author: data.author, wasSeenBy: { $ne: data.whoRead } }, // to do
        { $addToSet: { wasSeenBy: data.whoRead } }, { multi: true }, (err, messages) => {
        if(err) {
            console.log("error")
        }
        else {
            let target = connectedUsers.find(user => user.id === data.author)
            if (target) {
                socket.broadcast.to(target.socketId).emit("group_message_seen", data.groupId)
            }
        }
    })
}
