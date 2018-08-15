'use strict';

const express = require('express');
const router = express.Router();
const housesService = require('./houses-service');


router.get('/', function (req, res) {
    housesService.getAll((err, houses) => {
            if (err) {
                res.send({
                    msg: err
                }).sendStatus(500);
            } else if (houses !== null) {
                res.status(200).send(houses);
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
    housesService.get(_id, (err, house) => {
            if (err) {
                res.send({
                    msg: err
                }).sendStatus(500);
            } else if (house != null) {
                res.status(200).send(house);
            } else {
                res.send({
                    msg: err
                }).sendStatus(500);
            }
        }
    );

});

router.post('/', function (req, res) {
    let house = req.body;
    housesService.add(house, (err, house) => {
            if (err) {
                return res.send({
                    msg: err
                }).sendStatus(500);
            }
            if (house !== null) {
                return res.send({
                    msg: 'Nueva casa agregada'
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
    const updatedHouse = req.body;
    housesService.update(_id, updatedHouse, (err, numUpdates) => {
        if (err || numUpdates === 0) {
            res.statusCode = 404;
            res.send({
                msg: err
            });
        }
        else {
            res.statusCode = 200;
            return res.send({
                msg: 'Casa actualizado'
            });
        }
    });
});

router.delete('/:_id', function (req, res) {
    let _id = req.params._id;

    housesService.remove(_id, (err, numRemoved) => {
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