const mongoose = require('mongoose')

//const Conversations = require('../models/conversation')
const Messages = require('../models/message')
const Groups = require('../models/group')
const GroupMessages = require('../models/group_message')

exports.conversation_history = (req, res) => {
    Messages
        .find({ $or: [
            { $and: [{ recipient: req.userID }, { author: req.params.id }]},
            { $and: [{ recipient: req.params.id }, { author: req.userID }]}
        ]})
        .populate('author', '_id username')
        .exec((messagesErr, messages) => {
            res.send({
                status: "success",
                messages: messages,
                user: req.userID
            })
        })
}

exports.group_conversation_history = (req, res) => {
    Groups.findOne({ _id: req.params.id }, (groupErr, group) => {
        if (groupErr) {
            res.send({
                status: "error"
            })
        }
        else if (group) {
            GroupMessages
                .find({ groupId: group._id})
                .populate('author', '_id username')
                .exec((messagesErr, messages)  => {
                    res.send({
                        status: "success",
                        messages: messages,
                        groupId: group._id
                    })
                })
        }
        else {
            res.send({
                status: "no_such_conversation"
            })
        }
    })
}
