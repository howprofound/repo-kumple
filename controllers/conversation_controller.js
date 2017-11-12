const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const Conversations = require('../models/conversation')
const Messages = require('../models/message')

exports.conversation_history = (req, res) => {
    jwt.verify(req.headers.authorization, 'supersecretsecret', (err, decoded) => {
        if (err) {
            res.send({
                status: "error"
            })
        }
        else {
            Conversations.findOne({ users: { $in: [decoded.id, req.params.id] }
            }, (conversationErr, conversation) => {
                if (conversationErr) {
                    res.send({
                        status: "error"
                    })
                }
                else if (conversation) {
                    Messages.find({ conversationId: conversation.id
                    }, (messagesErr, messages) => {
                        res.send({
                            status: "success",
                            messages: messages
                        })
                    })
                }
                else {
                    Conversations.create({ title: "New", users: [decoded.id, req.params.id]
                    }, (newConversationErr, newConversation) => {
                        res.send({
                            status: "success",
                            messages: []
                        })
                    })
                }
            })
        }
    })
}
