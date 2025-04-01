import morgan, { StreamOptions } from 'morgan';

import logger from './winston.middleware';
import { SERVER, ENV_TYPE } from '../config';
const env = SERVER.ENV;

// Override the stream method by telling
// Morgan to use our custom logger instead of the console.log.
const stream: StreamOptions = {
    write: (message) => {
        logger.info(message.substring(0, message.lastIndexOf('\n')));
    }
};

// Skip all the Morgan http log if the
// application is not running in development mode.
// This method is not really needed here since
// we already told to the logger that it should print
// only warning and error messages in production.
const skip = () => {
    return env !== ENV_TYPE.Dev;
};

// const customFormat = ':method :url :status :res[content-length] - :response-time ms';
const customFormat = ':method :url HTTP/:http-version :status :res[content-length] - :response-time ms ';
// const customFormat = ':method :url :status :response-time ms :date[iso] :remote-addr :user-agent';
// const customFormat = ':method :url :status :res[content-length] - :response-time ms :date[iso] :remote-addr :user-agent';

// Build the morgan middleware
const morganMiddleware = morgan(
    // Define message format string (this is the default one).
    // The message format is made from tokens, and each token is
    // defined inside the Morgan library.
    // You can create your custom token to show what do you want from a request.
    customFormat,

    // Options: in this case, I overwrote the stream and the skip logic.
    // See the methods above.
    { stream, skip }
);

export default morganMiddleware;
