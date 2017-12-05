const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const jimp = require('jimp')
const fs = require('fs')
const lowerCase = require('lower-case')

const Users = require('../models/user')

const sendStatusAndUnlink = (req, res, status = "error") => {
    if(req.file)
        fs.unlink(req.file.destination + req.file.filename)
    res.send({
        status: status
    })
}

const processAvatar = (file) => {
    jimp.read(file.destination + file.filename)
}

const createUser = (req, res) => {
    console.log(req.body)
    req.body.username = lowerCase(req.body.username)
    req.body.email = lowerCase(req.body.email)
    req.body.password = crypto.createHash('sha1').update(req.body.password).digest('hex')
    Users.create(req.body, (errCreate, user) => {
        if(errCreate) {
            if(req.body.avatar)
                fs.unlink('public/' + req.body.avatar)
            sendStatusAndUnlink(req, res, "error")
        }
        else {
            sendStatusAndUnlink(req, res, "success")
        }
    })
}


exports.user_register = (req, res) => {
    req.body.username = lowerCase(req.body.username)
    req.body.email = lowerCase(req.body.email)
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
                    if(req.file) {
                        processAvatar(req.file).then(avatar => {
                            let filename = Date.now() + ".jpg"
                            avatar.resize(256, 256).write('public/' + filename)
                            req.body.avatar = filename
                            createUser(req, res)    
                        }).catch(err => {
                            sendStatusAndUnlink(req, res, "error")
                        })
                    }
                    else {
                        createUser(req, res)
                    }
                }
            })
        }
    })  
}

exports.user_login = (req, res) => {
    req.body.username = lowerCase(req.body.username)
    req.body.email = lowerCase(req.body.email)
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
    Users.findOne({ _id: req.userID }, 'username _id avatar', (error, user) => {
        if(error) {
            res.send({
                status: "error"
            })
        }
        else {
            res.send({
                status: "success",
                username: user.username,
                user: user
            })
        }
    })
}