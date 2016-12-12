var Promise                     = require("bluebird");
var _                           = require("lodash");
var cache                       = require("memory-cache");

var EmailContainerBase          = require("./base");
var EmailContainerContentful    = require("./contentful");
var logger                      = require("./../../logger");

var contentfulContainer         = new EmailContainerContentful({ type: "published" });

var cacheInitializePromise      = new Promise((resolve, reject) => {
    contentfulContainer.list()
        .then(function(entries) {
            cache.put("contentful-emails", JSON.stringify(entries || []));
            resolve();
        })
        .catch(reject);
});

class EmailContainerCache extends EmailContainerBase {
    constructor(options, config) {
        super(options, config);
    }
    list(filter) {
        return cacheInitializePromise
            .then(() => {
                var entries = JSON.parse(cache.get("contentful-emails"));
                logger.info("[services][email-container][cache] (list) Success - Total: %s", entries && entries.length || 0);
                return entries || [];
            })
            .catch(error => {
                logger.error("[services][email-container][cache] (list) [Error] - Message: %s Error: %j", error, error);
                throw error;
            });
    }
    get(id) {
        return this.list()
            .then(entries => {
                logger.info("[services][email-container][cache] (list) Success - Total: %s", entries && entries.length || 0);
                return _.find(entries, (entry) => _.get(entry, "sys.id") === id);
            })
            .catch(error => {
                logger.error("[services][email-container][cache] (list) [Error] - Message: %s Error: %j", error, error);
                throw error;
            });
    }
    getByName(name) {
        return this.list()
            .then(entries => {
                logger.info("[services][email-container][cache] (list) Success - Total: %s", entries && entries.length || 0);
                return _.find(entries, (entry) => _.get(entry, "fields.name") === name);
            })
            .catch(error => {
                logger.error("[services][email-container][cache] (list) [Error] - Message: %s Error: %j", error, error);
                throw error;
            });
    }
    upsert(upsertedEntry) {
        return this.list()
            .then(entries => {
                var entry = _.find(entries, entry => _.get(entry, "sys.id") === _.get(upsertedEntry, "sys.id"));

                if (entry) {
                    _.merge(entry, upsertedEntry);
                } else {
                    entries = entries.concat([ upsertedEntry ]);
                }
                
                cache.put("contentful-emails", JSON.stringify(entries || []));
                logger.info("[services][email-container][cache] (upsert) Success - Total: %s", entries && entries.length || 0);
                return upsertedEntry;
            })
            .catch(error => {
                logger.error("[services][email-container][cache] (upsert) [Error] - Message: %s Error: %j", error, error);
                throw error;
            });
    }
    delete(deletedEntry) {
        return this.list()
            .then(entries => {
                entries = _.remove(entries, entry => _.get(entry, "sys.id") === _.get(deletedEntry, "sys.id"));
                cache.put("contentful-emails", JSON.stringify(entries || []));
                logger.info("[services][email-container][cache] (delete) Success - Total: %s", entries && entries.length || 0);
                return deletedEntry;
            })
            .catch(error => {
                logger.error("[services][email-container][cache] (delete) [Error] - Message: %s Error: %j", error, error);
                throw error;
            });
    }
}

module.exports = EmailContainerCache;