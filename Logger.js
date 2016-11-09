const winston = require("winston");

loggerInstance = null;

class Logger {
    static getInstance() {
        if (loggerInstance === null) {
            loggerInstance = new Logger();
        }
        return loggerInstance;
    }

    constructor() {
        this._logger = new winston.Logger({
            transports: [
                new (winston.transports.File)({
                    name: 'info-file',
                    filename: 'logs/info.log',
                    level: 'info'
               }),
               new (winston.transports.Console)({
                   level: 'info'
               }),
               new (winston.transports.File)({
                   name: 'error-file',
                   filename: 'logs/error.log',
                   level: 'error'
               })
           ]
        });
    }

    info(string) {
        this._logger.log('info', string);
    }

    debug(string) {
        this._logger.log('debug', string);
    }

    error(string) {
        this._logger.log('error', string);
    }
}

module.exports = Logger.getInstance();

// debugging
// var l = Logger.getInstance();
// l.info("Testing logger.");
