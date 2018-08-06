'use strict';

const express = require('express');
const router = express.Router();
const clientsService = require('./clients-service');


router.get('/', function (req, res) {
    clientsService.getAll((err, clients) => {
            if (err) {
                res.send({
                    msg: err
                }).sendStatus(500);
            } else if (clients !== null) {
                res.status(200).send(clients);
            } else {
                res.send({
                    msg: err
                }).sendStatus(500);
            }
        }
    );
});

router.get('/:_id', function (req, res) {
    let _id = req.params._id;
    clientsService.get(_id, (err, client) => {
            if (err) {
                res.send({
                    msg: err
                }).sendStatus(500);
            } else if (client != null) {
                res.status(200).send(client);
            } else {
                res.send({
                    msg: err
                }).sendStatus(500);
            }
        }
    );

});

router.post('/', function (req, res) {
    let client = req.body;
    clientsService.add(client, (err, client) => {
            if (err) {
                return res.send({
                    msg: err
                }).sendStatus(500);
            }
            if (client !== null) {
                return res.send({
                    msg: 'Nuevo cliente agregado'
                });
            }
            else {
                return res.send({
                    msg: err
                }).sendStatus(500);
            }
        }
    );
});

router.put('/:_id', function (req, res) {
    const _id = req.params._id;
    const updatedClient = req.body;
    clientsService.update(_id, updatedClient, (err, numUpdates) => {
        if (err || numUpdates === 0) {
            res.statusCode = 404;
            res.send({
                msg: err
            });
        }
        else {
            res.statusCode = 200;
            return res.send({
                msg: 'Cliente actualizado'
            });
        }
    });
});

router.delete('/:_id', function (req, res) {
    let _id = req.params._id;

    clientsService.remove(_id, (err, numRemoved) => {
        if (err) {
            res.status(404).send({
                msg: err
            });
        }
        else {
            res.statusCode = 200;
            res.send(numRemoved.toString());
        }
    });
});


module.exports = router;