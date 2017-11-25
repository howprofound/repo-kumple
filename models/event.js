const mongoose = require("mongoose")

var EventSchema = new mongoose.Schema({
    title: String,
    description: String,
    place: String,
    beginTime: { type: Date, default: Date.now },
    endTime: { type: Date, default: Date.now },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
});

module.exports = mongoose.model('Event', EventSchema, 'Event')
