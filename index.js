const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const PORT = process.env.PORT || 8080;
const bodyParser = require('body-parser');
const baseAPI = '/api/v1';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + "/public/" + "index.html"));
});

app.use('/', express.static(__dirname + "/public/"));

/** ROUTERS **/

const articlesService = require('./routes/articles-service');
const articles = require('./routes/articles');

/*************/

const server = http.createServer(app);

app.use(baseAPI + '/articles', articles);

articlesService.connectDb(function (err) {
    if (err) {
        console.log("Could not connect with MongoDB - articlesService");
        process.exit(1);
    }

    server.listen(PORT, function () {
        console.log('Server with GUI up and running on localhost:' + PORT);
    });
});