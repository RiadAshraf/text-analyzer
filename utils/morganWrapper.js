// filepath: /Users/riad/Documents/codingPractice/text-analyzer/utils/morganWrapper.js
const morgan = require('morgan');
const logger = require('./logger');

// Create a Morgan stream that writes to Winston
const morganStream = {
    write: (message) => logger.info(message.trim()),
};

// Export Morgan middleware with the Winston stream
const morganMiddleware = morgan('combined', { stream: morganStream });

module.exports = morganMiddleware;