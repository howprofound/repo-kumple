const mongoose = require("mongoose")

var PublicConversationSchema = new mongoose.Schema({
    messagesCount: Number,
    usersCount: Number,
    messages: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Message'
    },
});


module.exports = mongoose.model('PublicConversation', PublicConversationSchema, 'PublicConversation')