const jwt = require('jsonwebtoken');
const { User } = require('../database/models');

const jwt_authenticate = (req, res, next) => {
    const header_authorize = req.headers.authorization;
    if (!header_authorize) return res.status(403).json();
    jwt.verify(header_authorize, process.env.JWT_SECRET_KEY, async (err, payload) => {
        req.user = await User.findByPk(payload.user.id);
        return (err || !req.user) ? res.status(403).json(err) : next();
    });
};

module.exports = jwt_authenticate;