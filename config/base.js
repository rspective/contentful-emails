var path = require("path");

module.exports = {
    env: {
        name    : undefined,
        locale  : undefined,
        host    : undefined,
        port    : 3000
    },
    paths: {
        views   : path.resolve("./front-end/views"),
        assets  : path.resolve("./front-end/assets")
    },
    authorization: {
        contentful: "<your-key>"
    },
    format: {
        date        : "DD-MM-YYYY",
        datetime    : "DD-MM-YYYY HH:mm:ss",
        currency    : {
            symbol  : "€",
            format  : "%v %s",
            decimal : ".",
            thousand: ","
        },
        number      : {
            decimal : ".",
            thousand: ","
        }
    },
    contentful: {
        draft: {
            space       : "<space-id>",
            accessToken : "<access-token>",
            host        : "preview.contentful.com"
        }, 
        published: {
            space       : "<space-id>",
            accessToken : "<access-token>",
            host        : "cdn.contentful.com"
        }
    },
    contact: {
        email   : "team@example.com",
        person  : "Team"
    }
};