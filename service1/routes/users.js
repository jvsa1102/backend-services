var express = require('express');
const req = require('express/lib/request');
var router = express.Router();
var jwt = require('jsonwebtoken');

const { User } = require('../database/models');
const jwt_authenticate = require('../middlewares/jwt_authenticate');
const user_authorize = require('../middlewares/user_authorize');

router.get('/', jwt_authenticate, user_authorize, async (req, res) => {
    res.json(await User.findAll());
});

router.get('/:id', jwt_authenticate, user_authorize, async (req, res) => {
    res.json(await User.findByPk(req.params.id));
});

router.post('/login', async (req, res) => {
    const {'token-timeout': timeout = 86400 } = req.headers;

    const { email, password } = req.body;

    
    try {
    let user = await User.findOne({where: { email, password }});
    if(!user) return res.status(404).json();
    console.log(user);
    const present_time = new Date();
    user.password = ''
    let payload = {
        user,
        loggedIn: present_time,
        expiresIn: new Date(present_time.getTime() + timeout * 1000)
    };

    return res.json({
        token: jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: timeout }),
        payload: payload
    })
    } catch (error) {
        return res.status(400).json(error);
    }
})

router.post('/', async (req, res) => {
    try {
        let user = await User.create(req.body);
        user.password = ''
        return res.json(user);
    } catch (error) {
        console.log(error)
        return res.status(400).json(error);
    }
})

router.put('/:id', jwt_authenticate, user_authorize, async (req, res) => {
    const { name, email } = req.body;
    try {
        let user = await User.findByPk(req.params.id);
        user.update({ name, email });
        return res.json(user);
    } catch (error) {
        console.log(error)
        return res.status(400).json(error);
    }
})

router.delete('/:id', jwt_authenticate, user_authorize, async (req, res) => {
    try {
        let user = await User.findByPk(req.params.id);
        user.destroy();
        return res.json(user);
    } catch (error) {
        console.log(error)
        return res.status(400).json(error);
    }
})

module.exports = router;
