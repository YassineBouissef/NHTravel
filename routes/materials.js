'use strict';

const express = require('express');
const router = express.Router();
const materialsService = require('./materials-service');


router.get('/', function (req, res) {
    materialsService.getAll((err, materials) => {
            if (err) {
                res.send({
                    msg: err
                }).sendStatus(500);
            } else if (materials !== null) {
                res.status(200).send(materials);
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
    materialsService.get(_id, (err, material) => {
            if (err) {
                res.send({
                    msg: err
                }).sendStatus(500);
            } else if (material != null) {
                res.status(200).send(material);
            } else {
                res.send({
                    msg: err
                }).sendStatus(500);
            }
        }
    );

});

router.post('/', function (req, res) {
    let material = req.body;
    materialsService.add(material, (err, material) => {
            if (err) {
                return res.send({
                    msg: err
                }).sendStatus(500);
            }
            if (material !== null) {
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
    const updatedMaterial = req.body;
    materialsService.update(_id, updatedMaterial, (err, numUpdates) => {
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

    materialsService.remove(_id, (err, numRemoved) => {
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