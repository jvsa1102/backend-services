const jwt = require('jsonwebtoken');
const { User } = require('../database/models');

const user_authorize = (req, res, next) => {
    if (!req.user.is_admin) {
        console.log('aaaaaaa')
        return res.status(403).json({
            message: "Usuário não é administrador"
        });
    }
    return next();
};

module.exports = user_authorize;