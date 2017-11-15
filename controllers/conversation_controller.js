const mongoose = require('mongoose')

const Conversations = require('../models/conversation')
const Messages = require('../models/message')

exports.conversation_history = (req, res) => {
    Conversations.findOne({ users: { $all: [req.userID, req.params.id] }
    }, (conversationErr, conversation) => {
        if (conversationErr) {
            res.send({
                status: "error"
            })
        }
        else if (conversation) {
            Messages.find({ conversationId: conversation._id
            }, (messagesErr, messages) => {
                res.send({
                    status: "success",
                    messages: messages,
                    conversationId: conversation._id
                })
            })
        }
        else {
            Conversations.create({ title: "New", users: [req.userID, req.params.id]
            }, (newConversationErr, newConversation) => {
                res.send({
                    status: "success",
                    messages: []
                })
            })
        }
    })
}
