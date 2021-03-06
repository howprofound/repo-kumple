const Events = require('../models/event')
const Users = require('../models/user')
const shared = require('../config/shared')
var connectedUsers = shared.connectedUsers
var io = shared.io

exports.get_events = (req, res) => {
    Events.find({ users: req.userID }, (error, events) => {
        if(error) {
            res.send({
                status: "error"
            })
        }
        else {
            Users.find({ _id: { $ne: req.userID }}, (usersError, users) => {
                if(usersError) {
                    res.send({
                        status: "error"
                    })
                }
                else {
                    res.send({
                        status: "success",
                        events: events,
                        users: users
                    })
                }
            })

        }
    })
}

exports.get_event = (req, res) => {
    Events.findOne({ _id: req.params.id }, (error, event) => {
        if(error) {
            res.send({
                status: "error"
            })
        }
        else if (event){
            res.send({
                status: "success",
                eventId: event._id
            })
        }
        else {
            res.send({
                status: "event not found"
            })
        }
    })
}

exports.add_event = (req, res) => {
    req.body.createdBy = req.userID
    req.body.going = []
    Events.create(req.body, (error, event) => {
        if(error) {
            res.send({
                status: "error"
            })
        }
        else {
            res.send({
                status: "success",
                event: event
            })
            connectedUsers.users.forEach(user => {
                if(req.userID !== user.id && req.body.users.includes(user.id)) {
                    io.to(user.socketId).emit("new_event", event)
                }
            })
           
        }
    })
}

exports.modify_going_list = (req, res) => {
    let query = {}
    if(req.body.going) {
        query = { $addToSet: { going: req.userID } }
    }
    else {
        query = { $pull: { going: req.userID} }
    }
    Events.findByIdAndUpdate(req.body.eventId, query, (err, event) => {
        if(err) {
            console.log(err)
            res.send({
                status: "error"
            })
        }
        else {
            res.send({
                status: "success"
            })
            for(i in connectedUsers) {
                if(connectedUsers[i].id !== req.userID && event.users.includes(connectedUsers[i].id)) {
                    io.to(connectedUsers[i].socketId).emit('event_going_change', {
                        eventId: req.body.eventId,
                        going: req.body.going,
                        user: req.userID
                    })
                }
            }
        }
    })
}

exports.modify_event_info = (req, res) => {
    Events.findOneAndUpdate({ _id: req.body.id },
        { title: req.body.title, description: req.body.description }, (error, event) => {
        if(error) {
            res.send({
                status: "error"
            })
        }
        else { // to do - socket
            res.send({
                status: "success",
                eventId: event._id
            })
        }
    })
}

exports.modify_event_place = (req, res) => {
    Events.findOneAndUpdate({ _id: req.body.id },
        { place: req.body.place }, (error, event) => {
        if(error) {
            res.send({
                status: "error"
            })
        }
        else { // to do - socket
            res.send({
                status: "success",
                eventId: event._id
            })
        }
    })
}

exports.modify_event_time = (req, res) => {
    Events.findOneAndUpdate({ _id: req.body.id },
        { beginTime: req.body.beginTime, endTime: req.body.endTime }, (error, event) => {
        if(error) {
            res.send({
                status: "error"
            })
        }
        else { // to do - socket
            res.send({
                status: "success",
                eventId: event._id
            })
        }
    })
}

exports.add_user_to_event = (req, res) => {
    Events.findOneAndUpdate({ _id: req.body.eventId },
        { $addToSet: { users: req.body.userId } }, (error, event) => {
        if(error) {
            res.send({
                status: "error"
            })
        }
        else if (event) { // to do - socket
            res.send({
                status: "user added",
                eventId: event._id
            })
        }
        else {
            res.send({
                status: "event not found"
            })
        }
    })
}

exports.remove_user_from_event = (req, res) => {
    Events.findOneAndUpdate({ _id: req.body.eventId },
        { $pull: { users: req.body.userId } }, (error, event) => {
        if(error) {
            res.send({
                status: "error"
            })
        }
        else if (event) { // to do - socket
            res.send({
                status: "user removed",
                eventId: event._id
            })
        }
        else {
            res.send({
                status: "event not found"
            })
        }
    })
}

exports.remove_event = (req, res) => {
    Events.remove({ _id: req.params.id }, (error, event) => {
        if(error) {
            res.send({
                status: "error"
            })
        }
        else if (event) { // to do - socket
            res.send({
                status: "success"
            })
        }
        else {
            res.send({
                status: "event not found"
            })
        }
    })
}