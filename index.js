const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const alerts = [];
const PORT = process.env.PORT || 8080;
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + "/public/" + "index.html"));
});

app.use('/', express.static(__dirname + "/public/"));

const server = http.createServer(app);

server.listen(PORT, function () {
    console.log('Server with GUI up and running on localhost:' + PORT);
});