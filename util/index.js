var Config          = require("./../config"); 

var HtmlUtil        = require("./html");
var FormatUtil      = require("./format");
var AccountingUtil  = require("./accounting");

class Util {
    constructor(config = Config.current) {
        this.config     = config;
        this.html       = new HtmlUtil(this.config);
        this.format     = new FormatUtil(this.config);
        this.accounting = new AccountingUtil(this.config);
    }
}

Util.current = new Util();

module.exports = Util;