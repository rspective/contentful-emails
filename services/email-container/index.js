var Promise                     = require("bluebird");

var EmailContainerBase          = require("./base");
var EmailContainerBackup        = require("./backup");
var EmailContainerCache         = require("./cache");
var EmailContainerContentful    = require("./contentful");
var EmailContainerParser        = require("./parser");
var Util                        = require("./../../util");

class EmailContainer extends EmailContainerBase {
    constructor(options = { container: "contentful", type: "draft" }, config) {
        super(options, config);

        if (options.container.toLowerCase() === "backup") {
            this.container = new EmailContainerBackup(options, this.config);
        } else if (options.container.toLowerCase() === "cache") {
            this.container = new EmailContainerCache(options, this.config);
        } else if (options.container.toLowerCase() === "contentful") {
            this.container = new EmailContainerContentful(options, this.config);
        }

        this.parser = new EmailContainerParser(options, this.config);
        this.util   = new Util(this.config);
    }
    list(filter) {
        return this.container && this.container.list && this.container.list(filter) 
            || Promise.reject("Method not supported");
    }
    get(id) {
        return this.container && this.container.get && this.container.get(id) 
            || Promise.reject("Method not supported");
    }
    getByName(name) {
        return this.container && this.container.getByName && this.container.getByName(name) 
            || Promise.reject("Method not supported");
    }
    render(name, context) {
        return this.getByName(name)
            .then((entry) => {
                var bodyHtml = this.parser.markdowToHtml(entry.fields.body);

                return {
                    subject : this.parser.parse(entry.fields.subject), 
                    body    : this.util.html.renderPlain(`{% extends "base.html" %}{% block body %}${bodyHtml}{% endblock %}`, "emails", context)
                };
            })
            .catch(error => {
                console.log(error);
            });
    }
}

EmailContainer.current = new EmailContainer();

module.exports = EmailContainer;