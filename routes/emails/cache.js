var express         = require("express");
var EmailContainer  = require("./../../services/email-container");

var router          = express.Router({ mergeParams: true });
var emailContainer  = new EmailContainer({ container: "cache" });

router.get("/preview/:id", (request, response, next) => {
    emailContainer.render(request.params.id)
        .then((emailEntry) => {
            response.status(200).json(emailEntry);
        })
        .catch((error) => {
            response.status(500).send(error);
        });
});

router.get("/", (request, response, next) => {
    emailContainer.list()
        .then(entries => {
            response.render("preview-cache", { entries: entries });
        })
        .catch(next);
});

module.exports = router;