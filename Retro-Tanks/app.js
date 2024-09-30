const express = require('express');
const app = express();

const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

const port = 3000;

app.use(express.static('client'));

app.get('/', (req, res) => {
    res.sendFile(_dirname + '/index.html');
});

const players = {};

io.on('connection', (socket) => {
    console.log('a user connected');
    players[socket.id] = { x: 750 * Math.random(), y: 500 * Math.random()};
    io.emit('updatePlayers', players);
    console.log(players);
})

server.listen(port, () => {
    console.log(`Game is listening on port ${port}..`);
})