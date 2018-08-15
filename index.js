const express = require('express');
const app = express();
const logger = require('morgan');
const http = require('http');
const path = require('path');
const PORT = process.env.PORT || 8080;
const bodyParser = require('body-parser');
const baseAPI = '/api/v1';

app.use(bodyParser.json());
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + "/public/" + "index.html"));
});

app.use('/', express.static(__dirname + "/public/"));
app.use('/casas', express.static(path.join(__dirname + '/public/casas.html')));
app.use('/clientes', express.static(path.join(__dirname + '/public/clientes.html')));
app.use('/clientes/:id', express.static(path.join(__dirname + '/public/clientes-view.html')));


/** ROUTERS **/

const articlesService = require('./routes/houses-service');
const articles = require('./routes/houses');

const clientsService = require('./routes/clients-service');
const clients = require('./routes/clients');

/*************/

const server = http.createServer(app);

app.use(baseAPI + '/houses', houses);
app.use(baseAPI + '/groups', groups);
app.use(baseAPI + '/clients', clients);


checksService.connectDb(function (err) {
    if (err) {
        console.log("Could not connect with MongoDB - checksService");
        process.exit(1);
    }
            clientsService.connectDb(function (err) {
                if (err) {
                    console.log("Could not connect with MongoDB - clientsService");
                    process.exit(1);
                }

                    housesService.connectDb(function (err) {
                        if (err) {
                            console.log("Could not connect with MongoDB - housesService");
                            process.exit(1);
                        }



                                    server.listen(PORT, function () {
                                        console.log('Server with GUI up and running on localhost:' + PORT);
                      });
               });
        });
   });

