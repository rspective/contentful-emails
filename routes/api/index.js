var express = require("express");

var router  = express.Router({ mergeParams: true });

[
    "email-container"
].map(route => router.use(`/${route}`, require(`./${route}`)));

module.exports = router;