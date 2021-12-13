const express = require('express');
const jwt = require('jsonwebtoken');
var router = express.Router();

const { OrderProduct } = require('../database/models');
const { Product } = require('../database/models');

async function updateOrderCost(order) {
    var cost = 0;

    await order.getOrderProducts().then((items) => {
        items.forEach(item => cost += item.amount * item.cost);
    });

    await order.update({ total_price: cost });
}

router.get('/', async (req, res) => {
    return res.json({ order: req.order, products: await req.order.getOrderProducts() });
});

router.post('/products', async (req, res) => {
    const { productId, amount } = req.body;

    if (amount < 1) return res.status(400).json()

    let product = await Product.findByPk(productId);
    if (!product) return res.status(400).json()

    let item = await OrderProduct.findOne({ where: { orderId: req.order.id, productId, cost: product.cost } });
    try {

        if (item) {
        var newAmount = amount + item.amount;
        await item.update({ amount: newAmount });
        } else {
        await OrderProduct.create({ orderId: req.order.id, productId, amount, cost: product.cost });
        }

        await updateOrderCost(req.order);

        return res.json({ order: req.order, products: await req.order.getOrderProducts() });
    } catch (e) {
        console.log(e);
        return res.status(400).json(e);
    }
});

// Remove Item From Cart
router.delete('/products/:id', async (req, res) => {
    const { amount } = req.body;

    let item = await OrderProduct.findOne({ where: { id: req.params.id, orderId: req.order.id } });
    if (!item) return res.status(400).json({ message: 'Invalid item.' });

    if (amount < -1) return res.status(400).json({ message: 'Invalid amount.' });

    try {
        var newAmount = item.amount - amount;
        if (amount == -1 || newAmount < 1) {
        await item.destroy();
        } else {
        await item.update({ amount: newAmount });
        }

        await updateOrderCost(req.order);

        return res.json({ order: req.order, products: await req.order.getOrderProducts() });
    } catch (e) {
        console.log(e);
        return res.status(400).json(e);
    }
});

// Pay Cart
router.put('/pay', async (req, res) => {
    if (req.order.total_price == 0.0) return res.status(400).json({ message: 'Nothing to be paid.' });

    try {
        await req.order.update({ paid: Date.now() });
        res.json({ order: req.order, products: await req.order.getOrderProducts() })
    } catch (e) {
        console.log(e);
        return res.status(400).json(e);
    }
});


module.exports = router;