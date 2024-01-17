let readyPlayerCount = 0

function listen(io) {

    io.on('connection', (socket) => {
        console.log('User Connected', socket.id)

        let room

        socket.on('ready', () => {
            console.log('Player ready', socket.id)

            room = 'room' + Math.floor(readyPlayerCount / 2)
            socket.join(room)

            readyPlayerCount++

            if (readyPlayerCount % 2 === 0) {
                io.in(room).emit('startGame', socket.id)
            }
        })

        socket.on('paddleMove', (paddleData) => {
            socket.to(room).emit('paddleMove', paddleData)
        })

        socket.on('ballMove', (ballData) => {
            socket.to(room).emit('ballMove', ballData)
        })

        socket.on('disconnect', (reason) => {
            console.log(`Client ${socket.id} disconnected: ${reason}`)
            socket.leave(room)
        })
    })
}

module.exports = {
    listen
}