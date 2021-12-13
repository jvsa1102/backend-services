const { Order } = require('../database/models');

const setOrder = async (req, res, next) => {
    let order = await req.user.getCurrentOrder();

    if (!order) order = await Order.create({ user_id: req.user.id });

    req.order = order;

    return next();
};

module.exports = setOrder;