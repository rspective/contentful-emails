var _       = require("lodash");
var fs      = require("fs");
var path    = require("path");

var config  = require("./base");

class Config {
    constructor(options = {}) {
        var specificConfig = _.cloneDeep(config);
        var env = options.env || process.env.NODE_ENV || "local";

        try {
            if (fs.statSync(path.join(__dirname, `./env/${env}.js`)).isFile()) {
                _.merge(specificConfig, require(`./env/${env}`));
            }
        } catch(exception) {}

        var locale = options.locale || "en-en";

        try {
            if (fs.statSync(path.join(__dirname, `./localized/${locale}.js`)).isFile()) {
                _.merge(specificConfig, require(`./localized/${locale}`));
            }
        } catch(exception) {}

        _.merge(this, specificConfig);
    }
}

Config.current = new Config();

module.exports = Config;