const config = require('./config')
const restify = require('restify')
const mongoose = require('mongoose')


const server = restify.createServer({
    name: config.name,
    version: config.version,
})

server.use(
    function crossOrigin(req,res,next){
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        return next();
    }
);
server.use(restify.plugins.jsonBodyParser({mapParams: true}))
server.use(restify.plugins.acceptParser(server.acceptable))
server.use(restify.plugins.queryParser({mapParams: true}))
server.use(restify.plugins.fullResponse())

server.listen(config.port, () => {
    console.log(`Server is listen on port ${config.port}`)
    mongoose.connect(config.db.uri)

    const db = mongoose.connection
    db.on('error', e => console.log(e))
    db.once('open', () => {
        console.log('Database is on')
        require('./routes/rating')(server)
        console.log('Routes configured')
    })
})
