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
app.use('/facturas/crear/:_id', express.static(path.join(__dirname + '/public/facturas.html')));
app.use('/facturas/editar/:_id', express.static(path.join(__dirname + '/public/facturas.html')));
app.use('/coches', express.static(path.join(__dirname + '/public/coches.html')));


/** ROUTERS **/

const housesService = require('./routes/houses-service');
const houses = require('./routes/houses');

const clientsService = require('./routes/clients-service');
const clients = require('./routes/clients');

const billsService = require('./routes/bills-service');
const bills = require('./routes/bills');

const checksService = require('./routes/checks-service');
const checks = require('./routes/checks');

const carsService = require('./routes/cars-service');
const cars = require('./routes/cars');

/*************/

const server = http.createServer(app);

app.use(baseAPI + '/houses', houses);
app.use(baseAPI + '/clients', clients);
app.use(baseAPI + '/bills', bills);
app.use(baseAPI + '/checks', checks);
app.use(baseAPI + '/cars', cars);



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

                            billsService.connectDb(function (err) {
                                if (err) {
                                    console.log("Could not connect with MongoDB - billsService");
                                    process.exit(1);
                                }

                                    carsService.connectDb(function (err) {
                                        if (err) {
                                            console.log("Could not connect with MongoDB - carsService");
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

