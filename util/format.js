var accounting  = require("accounting");
var _           = require("lodash");
var moment      = require("moment");

var Config      = require("./../config"); 

class FormatConfig {
    constructor(config = Config.current) {
        this.config = config;
    }
    date(date, format) {
        return date && moment(date).format(format || this.config.format.date) || "";
    }
    datetime(date, format) {
        return date && moment(date).format(format || this.config.format.datetime) || "";
    }
    currency(value = 0, options = {}) {
        return accounting.formatMoney(value, _.merge(_.cloneDeep(this.config.format.currency), options));
    }
    number(value = 0, precision = 0, options = {}) {
        return accounting.formatNumber(value, _.merge(_.cloneDeep(this.config.format.number), options, { precision: precision }));
    }
}

FormatConfig.current = new FormatConfig();

module.exports = FormatConfig;