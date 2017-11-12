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
    }, (err, conversation) =>{
        if(err) console.log(err)
        res.send(conversation)
    })
}