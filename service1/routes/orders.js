const express = require('express');
const jwt = require('jsonwebtoken');
var router = express.Router();

const { Order } = require('../database/models');
const { User } = require('../database/models');
const jwt_authenticate = require('../middlewares/jwt_authenticate');
const user_authorize = require('../middlewares/user_authorize');

router.get('/', jwt_authenticate, user_authorize, async (req, res) => {
    var orders;

    if (req.query.userId) {
        orders = await Order.findAll({ where: { userId: req.query.userId } });
    } else {
        orders = await Order.findAll();
    }

    return res.json(orders);
});


router.get('/:id', jwt_authenticate, async (req, res) => {
    let order = await Order.findByPk(req.params.id)

    if (!order) return res.status(404).json()

    return res.json({ order, products: await order.getOrderProducts() });
});

module.exports = router;