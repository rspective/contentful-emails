var express = require("express");

var router  = express.Router({ mergeParams: true });

[
    "backup",
    "cache",
    "contentful-draft",
    "contentful-published"
].map(route => router.use(`/${route}`, require(`./${route}`)));

module.exports = router;