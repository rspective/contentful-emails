var Config      = require("./../config"); 

class AccountingUtil {
    constructor(config = Config.current) {
        this.config = config;
    }
    round(value = 0, precission = 2) {
        return Number(Math.round(value + "e" + precission)+ "e-" + precission);
    }
}

AccountingUtil.current = new AccountingUtil();

module.exports = AccountingUtil;