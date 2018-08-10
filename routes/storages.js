'use strict';

const express = require('express');
const router = express.Router();
const storagesService = require('./storages-service');


router.get('/', function (req, res) {
    storagesService.getAll((err, storages) => {
            if (err) {
                res.send({
                    msg: err
                }).sendStatus(500);
            } else if (storages !== null) {
                res.status(200).send(storages);
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
    storagesService.get(_id, (err, storage) => {
            if (err) {
                res.send({
                    msg: err
                }).sendStatus(500);
            } else if (storage != null) {
                res.status(200).send(storage);
            } else {
                res.send({
                    msg: err
                }).sendStatus(500);
            }
        }
    );

});

router.post('/', function (req, res) {
    let storage = req.body;
    storagesService.add(storage, (err, storage) => {
            if (err) {
                return res.send({
                    msg: err
                }).sendStatus(500);
            }
            if (storage !== null) {
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
    const updatedStorage = req.body;
    storagesService.update(_id, updatedStorage, (err, numUpdates) => {
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

    storagesService.remove(_id, (err, numRemoved) => {
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