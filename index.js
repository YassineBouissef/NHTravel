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
app.use('/articulos', express.static(path.join(__dirname + '/public/articulos.html')));
app.use('/grupos', express.static(path.join(__dirname + '/public/grupos.html')));
app.use('/clientes', express.static(path.join(__dirname + '/public/clientes.html')));
app.use('/facturas/:_id', express.static(path.join(__dirname + '/public/facturas.html')));
app.use('/proveedores', express.static(path.join(__dirname + '/public/proveedores.html')));
app.use('/almacen', express.static(path.join(__dirname + '/public/almacen.html')));

/** ROUTERS **/

const articlesService = require('./routes/articles-service');
const articles = require('./routes/articles');

const groupsService = require('./routes/groups-service');
const groups = require('./routes/groups');

const clientsService = require('./routes/clients-service');
const clients = require('./routes/clients');

const providersService = require('./routes/providers-service');
const providers = require('./routes/providers');

const storagesService = require('./routes/storages-service');
const storages = require('./routes/storages');

/*************/

const server = http.createServer(app);

app.use(baseAPI + '/articles', articles);
app.use(baseAPI + '/groups', groups);
app.use(baseAPI + '/clients', clients);
app.use(baseAPI + '/providers', providers);
app.use(baseAPI + '/storages', storages);


providersService.connectDb(function (err) {
    if (err) {
        console.log("Could not connect with MongoDB - providersService");
        process.exit(1);
    }

    clientsService.connectDb(function (err) {
        if (err) {
            console.log("Could not connect with MongoDB - clientsService");
            process.exit(1);
        }

        groupsService.connectDb(function (err) {
            if (err) {
                console.log("Could not connect with MongoDB - groupsService");
                process.exit(1);
            }

            articlesService.connectDb(function (err) {
                if (err) {
                    console.log("Could not connect with MongoDB - articlesService");
                    process.exit(1);
                }

                storagesService.connectDb(function (err) {
                     if (err) {
                        console.log("Could not connect with MongoDB - storagesService");
                         process.exit(1);
                                }

                server.listen(PORT, function () {
                    console.log('Server with GUI up and running on localhost:' + PORT);
                });
            });
           });
        });
    });
});

