var express             = require("express");
var bodyParser          = require("body-parser");
var _                   = require("lodash");

var Config              = require("./../../../config");
var logger              = require("./../../../logger");
var EmailContainerCache = require("./../../../services/email-container/cache");

var router              = express.Router({ mergeParams: true });
var cacheContainer      = new EmailContainerCache();

function normalize(entry) {
    _.forEach(_.keys(entry.fields), key => {
        entry.fields[key] = _.values(entry.fields[key])[0] || entry.fields[key]; 
    });
    return entry;
}

router.use(bodyParser.json({ type: "application/vnd.contentful.management.v1+json" }));

router.post("/", (request, response) => {
    if (request.headers.authorization !== Config.current.authorization.contentful) {
        logger.error("[routes][api][email-container] [error] Security Token doesn't match: %s", request.headers.authorization);
        response.status(403).end();
        return;
    }

    var eventType   = request.headers["x-contentful-topic"] || null;
    var entry       = request.body; 

    logger.info("[routes][api][email-container] Request - Event Type: %s Entry: %j", eventType, entry);

    if (eventType === "ContentManagement.Entry.publish") {
        cacheContainer.upsert(normalize(entry));
    } else if (eventType === "ContentManagement.Entry.unpublish") {
        cacheContainer.delete(normalize(entry));
    }

    //-- Reply right away
    response.status(200).end();
});

module.exports = router;