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

io.on('connection', (socket) => {
    console.log('a user connected');
})

server.listen(port, () => {
    console.log(`Game is listening on port ${port}..`);
})