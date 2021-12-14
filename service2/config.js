const { MONGO_DB_KEY } = require('./keys')

module.exports = {
    name: 'service2',
    version: '1.0.0',
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3002,
    base_url: process.env.BASE_URL || 'http://localhost:3002',
    db: {
        uri: process.env.MONGODB_URI || `mongodb+srv://utfpr:${MONGO_DB_KEY}@cluster0.fyase.mongodb.net/restifyDatabase?retryWrites=true&w=majority`,
    },
};
