'use strict';

const express = require('express');
const router = express.Router();
const groupsService = require('./groups-service');


router.get('/', function (req, res) {
    groupsService.getAll((err, groups) => {
            if (err) {
                res.send({
                    msg: err
                }).sendStatus(500);
            } else if (groups !== null) {
                res.status(200).send(groups);
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
    groupsService.get(_id, (err, group) => {
            if (err) {
                res.send({
                    msg: err
                }).sendStatus(500);
            } else if (group != null) {
                res.status(200).send(group);
            } else {
                res.send({
                    msg: err
                }).sendStatus(500);
            }
        }
    );

});

router.post('/', function (req, res) {
    let group = req.body;
    groupsService.add(group, (err, group) => {
            if (err) {
                return res.send({
                    msg: err
                }).sendStatus(500);
            }
            if (group !== null) {
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
    const updatedGroup = req.body;
    groupsService.update(_id, updatedGroup, (err, numUpdates) => {
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

    groupsService.remove(_id, (err, numRemoved) => {
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