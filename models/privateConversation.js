const mongoose = require("mongoose")

var PrivateConversationSchema = new mongoose.Schema({
    messages: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Message'
    },
    user1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    user2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});


module.exports = mongoose.model('PrivateConversation', PrivateConversationSchema, 'PrivateConversation')