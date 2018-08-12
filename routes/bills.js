'use strict';

const express = require('express');
const router = express.Router();
const billsService = require('./bills-service');


router.get('/', function (req, res) {
    billsService.getAll((err, bills) => {
            if (err) {
                res.send({
                    msg: err
                }).sendStatus(500);
            } else if (bills !== null) {
                res.status(200).send(bills);
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
                res.status(200).send(bill);
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
    billsService.getClientBills(_id, (err, bill) => {
            if (err) {
                res.send({
                    msg: err
                }).sendStatus(500);
            } else if (bill != null) {
                res.status(200).send(bill);
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
    billsService.add(bill, (err, bill) => {
            if (err) {
                return res.send({
                    msg: err
                }).sendStatus(500);
            }
            if (bill !== null) {
                return res.send({
                    msg: 'Nuevo proveedor agregado'
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
    billsService.update(_id, updatedBill, (err, numUpdates) => {
        if (err || numUpdates === 0) {
            res.statusCode = 404;
            res.send({
                msg: err
            });
        }
        else {
            res.statusCode = 200;
            return res.send({
                msg: 'Proveedor actualizado'
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