const jwt = require('jsonwebtoken')

const Conversations = require('../models/conversation')

exports.conversation_create = (req, res) => {
    console.log(req.body)
    Conversations.create({
        title: req.body.title,
        isPrivate: req.body.isPrivate,
        messages: req.body.messages,
        users: req.body.users.map(user => {
            return mongoose.Types.ObjectId(user)
        })
    }, (err, conversation) => {
        if(err) console.log(err)
        res.send(conversation)
    })
}

exports.conversation_history = (req, res) => {
    jwt.verify(req.body.token, 'supersecretsecret', (verificationErr, decoded) => {
        if(verificationErr) res.send(verificationErr)
        console.log(decoded.id, req.body.id)
        Conversations.findOne({
            isPrivate: true,
            users: { $in: [decoded.id, req.body.id]}
        }, (conversationErr, conversation) => {	
            console.log(conversation)
            if(conversationErr) console.log(err)
            else if(conversation) {
                Messages.find({
                    _id: { $in: conversation.messages}
                }, (messsagesErr, messages) => {
                    if(messsagesErr) console.log(messages)
                    res.send(messages)
                })
            }
            else {
                Conversations.create({
                    title: "private",
                    isPrivate: true,
                    messages: [],
                    users: [decoded.id, req.body.id]
                }, (err, newConversation) => {
                    if(err) console.log(err)
                    res.send(newConversation.messages)
                })
            }
        })
    })
}