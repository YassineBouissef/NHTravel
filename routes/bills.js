'use strict';

const express = require('express');
const router = express.Router();
const billsService = require('./bills-service');
const encryption = require('./encrypt.js');


router.get('/', function (req, res) {
    billsService.getAll((err, bills) => {
            if (err) {
                res.send({
                    msg: err
                }).sendStatus(500);
            } else if (bills !== null) {
                let result = [];
                bills.forEach(c => {
                    let aux = encryption.decrypt(c.object);
                    aux._id = c._id;
                    result.push(aux)
                });
                res.status(200).send(result);
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
    billsService.get(_id, (err, bill) => {
            if (err) {
                res.send({
                    msg: err
                }).sendStatus(500);
            } else if (bill != null) {
                let result = [];
                bill.forEach(c => {
                    let aux = encryption.decrypt(c.object);
                    aux._id = c._id;
                    result.push(aux)
                });
                res.status(200).send(result);
            } else {
                res.send({
                    msg: err
                }).sendStatus(500);
            }
        }
    );

});

router.get('/type/:type', function (req, res) {
    let type = req.params.type;
    billsService.getAll((err, bill) => {
            if (err) {
                res.send({
                    msg: err
                }).sendStatus(500);
            } else if (bill != null) {
                let result = [];
                bill.forEach(c => {
                    let aux = encryption.decrypt(c.object);
                    aux._id = c._id;
                    if (aux.tipo === +type)
                        result.push(aux)
                });
                res.status(200).send(result);
            } else {
                res.send({
                    msg: err
                }).sendStatus(500);
            }
        }
    );
});

router.get('/type/:type/:year', function (req, res) {
    let type = req.params.type;
    let year = req.params.year;
    billsService.getAll((err, bill) => {
            if (err) {
                res.send({
                    msg: err
                }).sendStatus(500);
            } else if (bill != null) {
                let result = [];
                bill.forEach(c => {
                    let aux = encryption.decrypt(c.object);
                    aux._id = c._id;
                    if (aux.tipo === +type)
                        if (new Date(aux.fecha).getFullYear() === +year)
                            result.push(aux)
                });
                res.status(200).send(result);
            } else {
                res.send({
                    msg: err
                }).sendStatus(500);
            }
        }
    );
});

router.get('/client/:_id', function (req, res) {
    let _id = req.params._id;
    billsService.getAll((err, bills) => {
            if (err) {
                res.send({
                    msg: err
                }).sendStatus(500);
            } else if (bills != null) {
                let result = [];
                bills.forEach(c => {
                    let aux = encryption.decrypt(c.object);
                    aux._id = c._id;
                    if (aux.cliente._id === _id)
                        result.push(aux)
                });
                res.status(200).send(result);
            } else {
                res.send({
                    msg: err
                }).sendStatus(500);
            }
        }
    );

});

router.post('/', function (req, res) {
    let bill = req.body;
    let object = {object: encryption.encrypt(bill)};
    billsService.add(object, (err, bill) => {
            if (err) {
                return res.send({
                    msg: err
                }).sendStatus(500);
            }
            if (bill !== null) {
                return res.send({
                    msg: 'Nueva factura agregada'
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
    const updatedBill = req.body;
    let object = {object: encryption.encrypt(updatedBill)};
    billsService.update(_id, object, (err, numUpdates) => {
        if (err || numUpdates === 0) {
            res.statusCode = 404;
            res.send({
                msg: err
            });
        }
        else {
            res.statusCode = 200;
            return res.send({
                msg: 'Factura actualizada'
            });
        }
    });
});

router.delete('/:_id', function (req, res) {
    let _id = req.params._id;

    billsService.remove(_id, (err, numRemoved) => {
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