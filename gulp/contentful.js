var gulp            = require("gulp");
var _               = require("lodash");
var fs              = require("fs");
var Promise         = require("bluebird");
var path            = require("path");

var EmailContainer  = require("./../services/email-container");
var logger          = require("./../logger");

var contentfulPublished = new EmailContainer({ container: "contentful", type: "published" });

gulp.task("contentful-backup", (done) => {
    contentfulPublished.list()
        .then(entries => {
            logger.info("[gulp][contentful] (backup) Data retrieved - Entries: %s", entries.length);

            return new Promise((resolve, reject) => {
                fs.writeFile(path.resolve("./files/contentful-emails-backup.json"), JSON.stringify(entries), (error) => {
                    if (error) {
                        return reject(error);
                    }

                    resolve();
                });
            });
        })
        .then(() => {
            logger.info("[gulp][contentful] (backup) Backup finished");
        })
        .catch(error => {
            logger.error("[gulp][contentful] (backup) [error] Backup not finished - Message: %s Error: %j", error, error);
        })
        .done(done);
});