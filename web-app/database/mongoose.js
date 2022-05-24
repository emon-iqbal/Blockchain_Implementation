let mongoose = require('mongoose');
const logger = require('../services/logger');
const config = require('../loaders/config');



mongoose.Promise = global.Promise;
mongoose.connect( config.mongodbURI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    autoIndex: false
}).then(() => logger.info("Database connection is okay"))
    .catch((err) => {
        logger.error(err)
    });

module.exports = mongoose;
