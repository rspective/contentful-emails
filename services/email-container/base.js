var Config  = require("./../../config");

class EmailContainerBase {
    constructor(options, config = Config.current) {
        this.options = options;
        this.config = config;
    }
}

module.exports = EmailContainerBase;