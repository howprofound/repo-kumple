const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const Users = require('../models/user')

exports.user_register = (req, res) => {
    Users.findOne({ username: req.body.username }, (err, user) => {
        console.log(req.body)
        if(err) {
            res.send({
                status: "error"
            })
        }
        else if(user) {
            res.send({
                status: "user_found"
            })
        }
        else {
            Users.findOne({ email: req.body.email }, (err, user_mail) => {
                console.log(req.body)
                if(err) {
                    res.send({
                        status: "error"
                    })
                }
                else if(user_mail) {
                    res.send({
                        status: "mail_found"
                    })
                }
                else {
                    req.body.password = crypto.createHash('sha1').update(req.body.password).digest('hex')
                    Users.create(req.body, (err, user) => {
                        console.log(req.body)
                        if(err) {
                            res.send({
                                status: "error"
                            })
                        }
                        res.send({
                            status: "success"
                        })
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