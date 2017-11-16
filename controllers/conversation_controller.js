const mongoose = require('mongoose')

const Conversations = require('../models/conversation')
const Messages = require('../models/message')
const Groups = require('../models/group')
const GroupMessages = require('../models/group_message')

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

exports.group_conversation_history = (req, res) => {
    Groups.findOne({ _id: req.params.id }, (groupErr, group) => {
        if (groupErr) {
            res.send({
                status: "error"
            })
        }
        else if (group) {
            GroupMessages.find({ groupId: group._id
            }, (messagesErr, messages) => {
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

exports.group_conversation_create = (req, res) => {
      Groups.create(req.body, (groupErr, group) => {
          if (groupErr) {
              res.send({
                  status: "error"
              })
          }
          else {
              res.send({
                  status: "success",
                  groupId: group._id
              })
          }
      })
}
