const Users = require('../models/user')
const Messages = require('../models/message')
const Groups = require('../models/group')
const GroupMessages = require('../models/group_message')
var shared = require('../config/shared')
var connectedUsers = shared.connectedUsers


exports.load_chat_data = (req, res) => {
    let usersMessageCount = []
    let groupsMessageCount = []
    Users.find({ _id: { $ne: req.userID } }, 'username _id avatar firstName lastName email bio').then(users => {
        usersMessageCount = JSON.parse(JSON.stringify(users))
        let usersCount = []
        users.forEach(user => {
            usersCount.push(
                Messages.count({ wasSeen: false, author: user, recipient: req.userID })
            )
        })
        return Promise.all(usersCount)
    }).then(usersCount => {  
        Groups.find({ users: req.userID }).then(groups => {
            groupsMessageCount = JSON.parse(JSON.stringify(groups))
            let groupsCount = []
            groups.forEach(group => {
                groupsCount.push(
                    GroupMessages.count({ groupId: group._id, wasSeenBy: { $ne: req.userID }, author: { $ne: req.userID } })    
                )
            })
            return Promise.all(groupsCount)
        }).then(groupsCount => {
            usersMessageCount.forEach((userMessageCount, index) => {
                userMessageCount.unreadMessages = usersCount[index]
            })
            groupsMessageCount.forEach((groupMessageCount, index) => {
                groupMessageCount.unreadMessages = groupsCount[index]
            })
            res.send({
                status: "success",
                users: usersMessageCount,
                groups: groupsMessageCount
            })
        })
    }).catch(err => {
        res.send({
            status: "error"
        })
    })
}

exports.chat_connection = (userData, socket) => {
    socket.emit('connected_users', connectedUsers.users)
    let user = connectedUsers.users.find(cUser => cUser.id === userData.id)
    if(!user) {
        connectedUsers.users.push({
            id: userData.id,
            socketId: socket.id,
            groups: userData.groups
        })
    }
    else {
        user.groups = userData.groups
    }
    socket.broadcast.emit('user_change', {id: userData.id, isActive: true})
}

exports.chat_disconnection = (socket) => {
    let dcUser
    connectedUsers.users = connectedUsers.users.filter(user => {
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
        recipient: message.recipient
    }, (err, messageInstance) => {
        if (err) {
            console.log("error")
        }
        else {
            Messages.populate(messageInstance, {path: 'author', select: "_id username"}, (populateErr, messageInstance) => {    
                if(populateErr) {
                    console.log(populateErr)
                }    
                else {
                    let target = connectedUsers.users.find(user => user.id === message.recipient)
                    if (target) {
                        socket.broadcast.to(target.socketId).emit("new_message", messageInstance)
                    }
                    ack(messageInstance._id)
                }    
            })
        }
    })
}

exports.message_seen = (data, socket) => {
    Messages.update({ recipient: data.recipient, wasSeen: false, author: data.author }, { $set: { wasSeen: true } }, { multi: true }, (err, messages) => {
        if(err) {
            console.log("error")
        }
        else {
            let target = connectedUsers.users.find(user => user.id === data.author)
            if (target) {
                socket.broadcast.to(target.socketId).emit("message_seen", data.recipient)
            }
        }
    })
}

exports.new_group_message = (message, ack, socket) => {
    GroupMessages.create({
        content: message.content,
        author: message.author,
        wasDelivered: true,
        wasSeenBy: [message.author],
        groupId: message.groupId

    }, (err, messageInstance) => {
        if (err) {
            console.log("error")
        }
        else {
            GroupMessages.populate(messageInstance, {path: 'author', select: "_id username"}, (populateErr, messageInstance) => {
                if(populateErr) {
                    console.log("populateErr")
                }
                else {
                    for (i in connectedUsers.users) {
                        if(connectedUsers.users[i].groups.includes(message.groupId) && connectedUsers.users[i].id !== message.author){
                            socket.broadcast.to(connectedUsers.users[i].socketId).emit("new_group_message", messageInstance)
                        }
                    }
                    ack(messageInstance._id)
                }
            })

        }
    })
}

exports.group_message_seen = (data, socket) => {
    GroupMessages.update({ groupId: data.groupId, wasSeenBy: { $ne: data.userId } },
        { $addToSet: { wasSeenBy: data.userId } }, { multi: true }, (err, messages) => {
        if(err) {
            console.log("error")
        }
        else {
            for (i in connectedUsers.users) {
                if(connectedUsers.users[i].groups.includes(data.groupId)) {
                    socket.broadcast.to(connectedUsers.users[i].socketId).emit("group_message_seen", {
                        groupId: data.groupId,
                        userId: data.userId
                    })
                }
            }
        }
    })
}

exports.add_user_to_group = (data, socket) => {
    Groups.findByIdAndUpdate(data.groupId,
        { $addToSet: { users: data.userId } }, (err, group) => {
        if(err) {
            console.log("error")
        }
        else {
            for (i in connectedUsers.users) {
                if(connectedUsers.users[i].groups.includes(data.groupId)) {
                    shared.io.to(connectedUsers.users[i].socketId).emit("add_user_to_group", {
                        groupId: data.groupId,
                        userId: data.userId
                    })
                }
                else if(connectedUsers.users[i].id === data.userId) {
                    shared.io.to(connectedUsers.users[i].socketId).emit("added_to_group", {
                        group: group
                    })
                    connectedUsers.users[i].groups.push(data.groupId)
                }
            }
        }
    })
}

exports.delete_user_from_group = (data, socket) => {
    Groups.findByIdAndUpdate(data.groupId,
        { $pull: { users: data.userId } }, (err, group) => {
        if(err) {
            console.log("error")
        }
        else {
            for (i in connectedUsers.users) {
                if(connectedUsers.users[i].id === data.userId) {
                    connectedUsers.users[i].groups = connectedUsers.users[i].groups.filter(uGroup => uGroup !== data.groupId)
                    shared.io.to(connectedUsers.users[i].socketId).emit("deleted_from_group", {
                        groupId: data.groupId
                    })
                }
                else if(connectedUsers.users[i].groups.includes(data.groupId)) {
                    shared.io.to(connectedUsers.users[i].socketId).emit("delete_user_from_group", {
                        groupId: data.groupId,
                        userId: data.userId
                    })
                }
            }
        }
    })
}

exports.group_conversation_create = (data, socket, ack) => {
    Groups.create({ title: data.title, users: data.users }, (groupErr, group) => {
        if (groupErr) {
            console.log("error")
        }
        else {
            ack(group)
            for (i in connectedUsers.users) {
                if(data.users.includes(connectedUsers.users[i].id) && connectedUsers.users[i].socketId !== socket.id) {
                    socket.broadcast.to(connectedUsers.users[i].socketId).emit('group_conversation_create', {
                        groupId: group._id,
                        title: group.title,
                        users: group.users
                    })
                }
            }
        }
    })
}

exports.group_conversation_remove = (data, socket) => {
    Groups.remove({ _id: data.groupId }, (groupErr, group) => {
        if (groupErr) {
            console.log("error")
        }
        else {
            for (i in connectedUsers.users) {
                if(connectedUsers.users[i].groups.includes(data.groupId)) {
                    socket.broadcast.to(connectedUsers.users[i].socketId).emit("group_conversation_delete", {
                        groupId: data.groupId,
                    })
                }
            }
        }
    })
}

exports.calendar_connection = ( userId, socket) => {
    let user = connectedUsers.users.find(cUser => cUser.id === userId)
    if(!user) {
        connectedUsers.users.push({
            id: userId,
            socketId: socket.id,
            groups: []
        })
    }
}