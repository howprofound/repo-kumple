const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const Users = require('../models/user')
const jimp = require('jimp')
const fs = require('fs')

const sendStatusAndUnlink = (req, res, status = "error") => {
    fs.unlink(req.file.destination + req.file.filename)
    res.send({
        status: status
    })
}

exports.user_register = (req, res) => {
    Users.findOne({ username: req.body.username }, (errUsername, user) => {
        if(errUsername) {
            sendStatusAndUnlink(req, res, "error")
        }
        else if(user) {
            sendStatusAndUnlink(req, res, "user_found")
        }
        else {
            Users.findOne({ email: req.body.email }, (errEmail, user_mail) => {
                if(errEmail) {
                    sendStatusAndUnlink(req, res, "error")
                }
                else if(user_mail) {
                    sendStatusAndUnlink(req, res, "mail_found")
                }
                else {
                    jimp.read(req.file.destination + req.file.filename, (errAvatar, avatar) => {
                        if(errAvatar) {
                                    sendStatusAndUnlink(req, res, "error")
                        }
                        else {
                            let filename = Date.now() + ".jpg"
                            avatar.resize(256, 256).write('public/' + filename, (err) => { // create resized image <-- this line is the importantest!
                                req.body.avatar = filename
                                if(err) {
                                    sendStatusAndUnlink(req, res, "error")
                                }
                                else {
                                    req.body.password = crypto.createHash('sha1').update(req.body.password).digest('hex')
                                    Users.create(req.body, (errCreate, user) => {
                                        if(errCreate) {
                                            fs.unlink('public/' + filename)
                                            sendStatusAndUnlink(req, res, "error")
                                        }
                                        else {
                                            sendStatusAndUnlink(req, res, "success")
                                        }
                                    })
                                }
                            }) 
                        }
                    })
                }
            })
        }
    })  
}

exports.user_login = (req, res) => {
    Users.findOne({ username: req.body.username }, (err, user) => {
        console.log(req.body)
        if(err) {
            res.send({
                status: "error"
            })
        }
        else if(!user) {
            res.send({
                status: "wrong_data"
            })
        }
        else {
            req.body.password = crypto.createHash('sha1').update(req.body.password).digest('hex')
            if(!user.validPassword(req.body.password)) {
                res.send({
                    status: "wrong_data"
                })
            }
            else {
                let token = jwt.sign({id: user._id}, 'supersecretsecret', {
                    expiresIn: "2h"
                })
                res.send({
                    status: "success",
                    token: token
                })
            }
        }
    })
}

exports.get_user = (req, res) => {
    Users.findOne({ _id: req.userID }, 'username _id', (error, user) => {
        if(error) {
            res.send({
                status: "error"
            })
        }
        else {
            res.send({
                status: "success",
                username: user.username
            })
        }
    })
}