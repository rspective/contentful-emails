var Contentful          = require("contentful");
var Promise             = require("bluebird");

var EmailContainerBase  = require("./base");
var logger              = require("./../../logger");

class EmailContainerContentful extends EmailContainerBase {
    constructor(options, config) {
        super(options, config);

        if (this.options.type.toLowerCase() === "published") {
            this.contentful = Contentful.createClient(this.config.contentful.published); 
        } else {
            this.contentful = Contentful.createClient(this.config.contentful.draft);
        }
    }
    list(filter) {
        return new Promise((resolve, reject) => {
            this.contentful.getEntries(filter || { limit: 1000, "content_type" : "email" })
                .then(entries => {
                    logger.info("[services][email-container][contentful] (list) Success - Total: %s", entries && entries.total || 0);
                    resolve(entries && entries.items || []);
                })
                .catch(error => {
                    logger.error("[services][email-container][contentful] (list) [Error] - Message: %s Error: %j", error, error);
                    reject(error);
                });
        });
    }
    get(id) {
        return new Promise((resolve, reject) => {
            this.contentful.getEntry(id)
                .then(entry => {
                    logger.info("[services][email-container][contentful] (get) Success: %s", entry && entry.sys && entry.sys.id || id);
                    resolve(entry);
                })
                .catch(error => {
                    logger.error("[services][email-container][contentful] (get) [Error] - Message: %s Error: %j", error, error);
                    reject(error);
                });
        });
    }
    getByName(name) {
        return new Promise((resolve, reject) => {
            this.contentful.getEntries({ "fields.name": name, "content_type" : "email", limit: 1 })
                .then(entries => {
                    logger.info("[services][email-container][contentful] (get) Success: %s", entries.total);

                    if (entries.total > 0) {
                        resolve(entries.items[0]);
                    } else {
                        throw `Record '${name}' not found`;
                    }
                })
                .catch(error => {
                    logger.error("[services][email-container][contentful] (get) [Error] - Message: %s Error: %j", error, error);
                    reject(error);
                });
        });
    }
}

module.exports = EmailContainerContentful;