const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('client'));

app.get('/', (req, res) => {
    res.sendFile(_dirname + '/index.html');
});

app.listen(port, () => {
    console.log(`Game is listening on port ${port}..`);
})