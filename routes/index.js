var express = require("express");

var router  = express.Router({ mergeParams: true });

[
    "api",
    "emails"
].map(route => router.use(`/${route}`, require(`./${route}`)));

router.get("/", (request, response) => {
    response.render("index");
});

module.exports = router;