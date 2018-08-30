'use strict';

const express = require('express');
const router = express.Router();
const carsService = require('./cars-service');


router.get('/', function (req, res) {
    carsService.getAll((err, cars) => {
            if (err) {
                res.send({
                    msg: err
                }).sendStatus(500);
            } else if (cars !== null) {
                res.status(200).send(cars);
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
    carsService.get(_id, (err, car) => {
            if (err) {
                res.send({
                    msg: err
                }).sendStatus(500);
            } else if (car != null) {
                res.status(200).send(car);
            } else {
                res.send({
                    msg: err
                }).sendStatus(500);
            }
        }
    );

});

router.post('/', function (req, res) {
    let car = req.body;
    carsService.add(car, (err, car) => {
            if (err) {
                return res.send({
                    msg: err
                }).sendStatus(500);
            }
            if (car !== null) {
                return res.send({
                    msg: 'Nuevo coche agregada'
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
    const updatedCar = req.body;
    carsService.update(_id, updatedCar, (err, numUpdates) => {
        if (err || numUpdates === 0) {
            res.statusCode = 404;
            res.send({
                msg: err
            });
        }
        else {
            res.statusCode = 200;
            return res.send({
                msg: 'Coche actualizado'
            });
        }
    });
});

router.delete('/:_id', function (req, res) {
    let _id = req.params._id;

    carsService.remove(_id, (err, numRemoved) => {
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