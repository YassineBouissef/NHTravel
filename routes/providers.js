'use strict';

const express = require('express');
const router = express.Router();
const providersService = require('./providers-service');


router.get('/', function (req, res) {
    providersService.getAll((err, providers) => {
            if (err) {
                res.send({
                    msg: err
                }).sendStatus(500);
            } else if (providers !== null) {
                res.status(200).send(providers);
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
    providersService.get(_id, (err, provider) => {
            if (err) {
                res.send({
                    msg: err
                }).sendStatus(500);
            } else if (provider != null) {
                res.status(200).send(provider);
            } else {
                res.send({
                    msg: err
                }).sendStatus(500);
            }
        }
    );

});

router.post('/', function (req, res) {
    let provider = req.body;
    providersService.add(provider, (err, provider) => {
            if (err) {
                return res.send({
                    msg: err
                }).sendStatus(500);
            }
            if (provider !== null) {
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
    const updatedProvider = req.body;
    providersService.update(_id, updatedProvider, (err, numUpdates) => {
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

    providersService.remove(_id, (err, numRemoved) => {
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