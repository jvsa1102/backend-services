const express = require('express');
var router = express.Router();

const { Product } = require('../database/models');

const jwt_authenticate = require('../middlewares/jwt_authenticate');
const user_authorize = require('../middlewares/user_authorize');

router.get('/', jwt_authenticate, user_authorize, async (req, res, next) => {
    return res.json(await Product.findAll());
});

router.get('/:id', jwt_authenticate, async (req, res) => {
    let product = await Product.findByPk(req.params.id)

    if (!product) return res.status(404).json()

    return res.json(product);
});

router.post('/', jwt_authenticate, user_authorize, async (req, res) => {
    try {
        let product = await Product.create(req.body);
        return res.json(product);
    } catch (e) {
        console.log(e);
        return res.status(400).json(e);
    }
});

router.put('/:id', jwt_authenticate, user_authorize, async (req, res) => {
    const { name, cost } = req.body;

    let product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json()

    try {
        await product.update({ name, cost });
        return res.json(product);
    } catch (e) {
        console.log(e);
        res.status(400).json(e);
    }
});

router.delete('/:id', jwt_authenticate, user_authorize, async (req, res) => {
    let product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json()

    try {
        await product.destroy();
        return res.json(product);
    } catch (e) {
        console.log(e);
        res.status(400).json(e);
    }
});

module.exports = router;