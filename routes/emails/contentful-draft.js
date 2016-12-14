var express         = require("express");
var EmailContainer  = require("./../../services/email-container");

var router          = express.Router({ mergeParams: true });
var emailContainer  = new EmailContainer({ container: "contentful", type: "draft" });

var payload         = require("./data");

router.get("/preview/:id", (request, response, next) => {
    emailContainer.render(request.params.id, payload)
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
            response.render("preview-draft", { entries: entries });
        })
        .catch(next);
});

module.exports = router;