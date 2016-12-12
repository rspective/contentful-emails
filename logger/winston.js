var winston = require("winston");

module.exports = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            json    : false,
            colorize: true
        })
    ]
});