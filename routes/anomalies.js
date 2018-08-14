'use strict';

const express = require('express');
const router = express.Router();
const anomaliesService = require('./anomalies-service');


router.get('/', function (req, res) {
    anomaliesService.getAll((err, anomalies) => {
            if (err) {
                res.send({
                    msg: err
                }).sendStatus(500);
            } else if (anomalies !== null) {
                res.status(200).send(anomalies);
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
    anomaliesService.get(_id, (err, anomalie) => {
            if (err) {
                res.send({
                    msg: err
                }).sendStatus(500);
            } else if (anomalie != null) {
                res.status(200).send(anomalie);
            } else {
                res.send({
                    msg: err
                }).sendStatus(500);
            }
        }
    );

});

router.post('/', function (req, res) {
    let anomalie = req.body;
    anomaliesService.add(anomalie, (err, anomalie) => {
            if (err) {
                return res.send({
                    msg: err
                }).sendStatus(500);
            }
            if (anomalie !== null) {
                return res.send({
                    msg: 'Nueva anonalía agregada'
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
    const updatedanomalie = req.body;
    anomaliesService.update(_id, updatedanomalie, (err, numUpdates) => {
        if (err || numUpdates === 0) {
            res.statusCode = 404;
            res.send({
                msg: err
            });
        }
        else {
            res.statusCode = 200;
            return res.send({
                msg: 'Anomalía actualizada'
            });
        }
    });
});

router.delete('/:_id', function (req, res) {
    let _id = req.params._id;

    anomaliesService.remove(_id, (err, numRemoved) => {
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