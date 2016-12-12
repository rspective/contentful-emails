var Promise             = require("bluebird");
var marked              = require("marked");
var _                   = require("lodash");

var logger              = require("./../../logger");

class EmailContainerParser {
    constructor(options, config) {
        this.options = options;
        this.config = config;
    }
    parse(content) {
        var tags = {
            "customer-name" : "{{ customer && customer.name }}",
            "contact-person": this.config.contact.person,
            "contact-email" : this.config.contact.email
        };

        return _.reduce(tags, function(result, value, key) {
            return result.split(`[[${key}]]`).join(value);
        }, content);
    }
    markdowToHtml(markdown) {
        logger.info("[services][email-container][parser] Transforming Markdown to Html");
        return this.parse(marked(markdown));
    }
}

module.exports = EmailContainerParser;