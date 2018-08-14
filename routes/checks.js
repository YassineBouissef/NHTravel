'use strict';

const express = require('express');
const router = express.Router();
const checksService = require('./checks-service');


router.get('/', function (req, res) {
    checksService.getAll((err, checks) => {
            if (err) {
                res.send({
                    msg: err
                }).sendStatus(500);
            } else if (checks !== null) {
                res.status(200).send(checks);
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
    checksService.get(_id, (err, check) => {
            if (err) {
                res.send({
                    msg: err
                }).sendStatus(500);
            } else if (check != null) {
                res.status(200).send(check);
            } else {
                res.send({
                    msg: err
                }).sendStatus(500);
            }
        }
    );

});

router.post('/', function (req, res) {
    let check = req.body;
    checksService.add(check, (err, check) => {
            if (err) {
                return res.send({
                    msg: err
                }).sendStatus(500);
            }
            if (check !== null) {
                return res.send({
                    msg: 'Nuevo articulo agregado'
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
    const updatedCheck = req.body;
    checksService.update(_id, updatedCheck, (err, numUpdates) => {
        if (err || numUpdates === 0) {
            res.statusCode = 404;
            res.send({
                msg: err
            });
        }
        else {
            res.statusCode = 200;
            return res.send({
                msg: 'Articulo actualizado'
            });
        }
    });
});

router.delete('/:_id', function (req, res) {
    let _id = req.params._id;

    checksService.remove(_id, (err, numRemoved) => {
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