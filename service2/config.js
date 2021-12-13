module.exports = {
    name: 'service2',
    version: '1.0.0',
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    base_url: process.env.BASE_URL || 'http://localhost:3000',
    db: {
        uri: process.env.MONGODB_URI || 'mongodb+srv://utfpr:utfpr@cluster0.fyase.mongodb.net/restifyDatabase?retryWrites=true&w=majority',
    },
};
