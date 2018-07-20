'use strict';

const express = require('express');
const router = express.Router();
const articlesService = require('./articles-service');


router.get('/', function (req, res) {
    articlesService.getAll((err, articles) => {
            if (err) {
                res.send({
                    msg: err
                }).sendStatus(500);
            } else if (articles !== null) {
                res.status(200).send(articles);
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
    articlesService.get(_id, (err, article) => {
            if (err) {
                res.send({
                    msg: err
                }).sendStatus(500);
            } else if (article != null) {
                res.status(200).send(article);
            } else {
                res.send({
                    msg: err
                }).sendStatus(500);
            }
        }
    );

});

router.post('/', function (req, res) {
    let article = req.body;
    articlesService.add(article, (err, article) => {
            if (err) {
                return res.send({
                    msg: err
                }).sendStatus(500);
            }
            if (article !== null) {
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
    const updatedArticle = req.body;
    articlesService.update(_id, updatedArticle, (err, numUpdates) => {
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

    articlesService.remove(_id, (err, numRemoved) => {
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