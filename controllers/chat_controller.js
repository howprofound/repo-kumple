const Users = require('../models/user')
const Conversations = require('../models/conversation')
const Messages = require('../models/message')
const Groups = require('../models/group')
const GroupMessages = require('../models/group_message')
const Files = require('../models/files')

var connectedUsers = []

const createMessage = (message, ack, socket, fileId) => {
  Messages.create({
      content: message.content,
      author: message.author,
      wasDelivered: true,
      wasSeen: false,
      conversationId: message.conversationId,
      isFile: message.isFile,
      fileId: fileId

  }, (err, messageInstance) => {
      if (err) {
          console.log("error")
      }
      else {
          let target = connectedUsers.find(user => user.id === message.addresse)
          if (target) {
              socket.broadcast.to(target.socketId).emit("new_message", messageInstance)
          }
          ack(messageInstance._id)
      }
  })
}

const createGroupMessage = (message, ack, socket, fileId) => {
  GroupMessages.create({
      content: message.content,
      author: message.author,
      wasDelivered: true,
      wasSeenBy: [],
      groupId: message.groupId,
      isFile: message.isFile,
      fileId: fileId

  }, (err, messageInstance) => {
      if (err) {
          console.log("error")
      }
      else {
          for (i in connectedUsers) {
              if(connectedUsers[i].groups.includes(message.groupId) && connectedUsers[i].id !== message.author){
                  socket.broadcast.to(connectedUsers.socketId).emit("new_group_message", messageInstance)
                  ack(messageInstance._id)
              }
          }
      }
  })
}

exports.load_chat_data = (req, res) => {
    Users.find({_id: { $ne: req.userID }}, 'username _id', (err, users) => {
        Groups.find({users: req.userID}, (err, groups) => {
            if(err) {
                res.send({
                    status: "error"
                })
            }
            else {
                res.send({
                    status: "success",
                    users: users,
                    groups: groups
                })
            }
        })
    })
}

exports.chat_connection = (userData, socket) => {
    socket.emit('connected_users', connectedUsers)
    connectedUsers.push({
        id: userData.id,
        socketId: socket.id,
        groups: userData.groups
    })
    socket.broadcast.emit('user_change', {id: userData.id, isActive: true})
}

exports.chat_disconnection = socket => {
    let dcUser
    connectedUsers = connectedUsers.filter(user => {
        if(user.socketId !== socket.id)
            return true
        else {
            dcUser = user.id
            return false
        }
    })
    socket.broadcast.emit('user_change', {id: dcUser, isActive: false})
    Users.findOneAndUpdate({
        _id: dcUser
    }, {
        $set: { lastLogin: Date.now() }
    }, err => {
        if(err) console.log(err)
    })
}

exports.new_message = (message, ack, socket) => {

  if (message.isFIle) {
    var timeInMs = Date.now()
    fs.writeFile('public/files/' + timeInMs, message.file, "binary", function(err) {
    if(err) {
        console.log(err)
    } else {
        console.log("The file was saved!")
        Files.create({
            fileName: timeInMs,
            fileOriginalName: message.fileName

        }, (err, fileInstance) => {
            if (err) {
                console.log("error")
                fs.unlink('public/files/' + timeInMs, (err) => {
                if (err) throw err;
                  console.log('successfully deleted /public/files/' + timeInMs);
                });
            }
            else {
                createMessage(message, ack, socket, fileInstance._id)
            }
        })
      }
    })
  }else {
      createMessage(message, ack, socket)
  }
}

exports.message_seen = (data, socket) => {
    Messages.update({ conversationId: data.conversationId, wasSeen: false, author: data.author }, { $set: { wasSeen: true } }, { multi: true }, (err, messages) => {
        if(err) {
            console.log("error")
        }
        else {
            if (isFIle) {
                //todo
            }
            let target = connectedUsers.find(user => user.id === data.author)
            if (target) {
                socket.broadcast.to(target.socketId).emit("message_seen", data.conversationId)
            }
        }
    })
}

exports.new_group_message = (message, ack, socket) => {

    if (message.isFIle) {
      var timeInMs = Date.now()
      fs.writeFile('public/files/' + timeInMs, message.file, "binary", function(err) {
      if(err) {
          console.log(err)
      } else {
          console.log("The file was saved!")
          Files.create({
              fileName: timeInMs,
              fileOriginalName: message.fileName

          }, (err, fileInstance) => {
              if (err) {
                  console.log("error")
                  fs.unlink('public/files/' + timeInMs, (err) => {
                  if (err) throw err;
                    console.log('successfully deleted /public/files/' + timeInMs);
                  });
              }
              else {
                  creatGroupeMessage(message, ack, socket, fileInstance._id)
              }
          })
      }
      })
    }
    else {
        creatGroupeMessage(message, ack, socket)
    }
}

exports.group_message_seen = (data, socket) => {
    GroupMessages.update({ groupId: data.groupId },
        { $addToSet: { wasSeenBy: data.userId } }, { multi: true }, (err, messages) => {
        if(err) {
            console.log("error")
        }
        else {
            for (i in connectedUsers) {
                if(connectedUsers[i].groups.includes(data.groupId) && connectedUsers[i].id !== data.userId){
                    socket.broadcast.to(connectedUsers.socketId).emit("group_message_seen", {
                        groupId: data.groupId,
                        userId: data.userId
                    })
                }
            }
        }
    })
}
