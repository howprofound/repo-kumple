
var shared = module.exports = {
    connectedUsers: {
        users: [],
        addUser: (user) => {
            connectedUsers.users.push(user)
        },
        deleteUser: (userId) => {
            connectedUsers.users = connectedUsers.users.filter(user => user.id !== userId)
        }
    },
    io: null,
    setIo(io) {
        shared.io = io
    }
}
