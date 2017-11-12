//const express = require('express')
//const router = express.Router()
const jwt = require('jsonwebtoken')

const Users = require('../models/user')
const crypto = require('crypto')
//const mongoose = require('mongoose');

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