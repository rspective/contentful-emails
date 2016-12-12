var Promise             = require("bluebird");
var fs                  = require("fs");
var path                = require("path");
var _                   = require("lodash");

var EmailContainerBase  = require("./base");
var logger              = require("./../../logger");

var backupInitilizePromise = new Promise((resolve, reject) => {
    fs.readFile(path.resolve("./files/contentful-emails-backup.json"), function(error, content) {
        if (error) {
            return reject(error);
        }

        try {
            resolve(JSON.parse(content));
        } catch(exception) {
            reject(exception);
        }
    });
});

class EmailContainerBackup extends EmailContainerBase {
    constructor(options, config) {
        super(options, config);
    }
    list(filter) {
        return backupInitilizePromise
            .then(entries => {
                logger.info("[services][email-container][backup] (list) Success - Total: %s", entries && entries.length || 0);
                return entries || [];
            })
            .catch(error => {
                logger.error("[services][email-container][backup] (list) [Error] - Message: %s Error: %j", error, error);
                throw error;
            });
    }
    get(id) {
        return backupInitilizePromise
            .then(entries => {
                logger.info("[services][email-container][backup] (list) Success - Total: %s", entries && entries.length || 0);
                return _.find(entries, entry => _.get(entry, "sys.id") === id);
            })
            .catch(error => {
                logger.error("[services][email-container][backup] (list) [Error] - Message: %s Error: %j", error, error);
                throw error;
            });
    }
    getByName(name) {
        return backupInitilizePromise
            .then(entries => {
                logger.info("[services][email-container][backup] (list) Success - Total: %s", entries && entries.length || 0);
                return _.find(entries, entry => _.get(entry, "fields.name") === name);
            })
            .catch(error => {
                logger.error("[services][email-container][backup] (list) [Error] - Message: %s Error: %j", error, error);
                throw error;
            });
    }
}

module.exports = EmailContainerBackup;