const express = require('express');
const app = express();

const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');

const io = new Server(server, { pingInterval: 2000, pingTimeout: 4000 });

const port = 3000;

app.use(express.static('client'));

app.get('/', (req, res) => {
    res.sendFile(_dirname + '/index.html');
});

const serverPlayers = {};

io.on('connection', (socket) => {
    console.log('a user connected');
    serverPlayers[socket.id] = { x: 750 * Math.random(), y: 500 * Math.random() };
    io.emit('updatePlayers', serverPlayers);

    socket.on('disconnect', (reason) => {
        console.log(reason);
        delete serverPlayers[socket.id];
        io.emit('updatePlayers', serverPlayers);
    })
})

server.listen(port, () => {
    console.log(`Game is listening on port ${port}..`);
})