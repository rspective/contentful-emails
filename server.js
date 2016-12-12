process.env.TZ = "UTC";

var express         = require("express");
var swig            = require("swig");
var bodyParser     = require("body-parser");

var Config          = require("./config");
var Util            = require("./util");
var logger          = require("./logger");

//-- Create App
var app = express();

app.use(bodyParser.json({ limit: "50mb" }));

//-- Configure View Engine
app.engine("html", swig.renderFile);
app.set("view engine", "html");
app.set("views", Config.current.paths.views);

app.use("/assets", express.static(Config.current.paths.assets));

//-- Set variables for view rendering
app.use(function(request, response, next) {
    response.locals.__config = Config.current;
    response.locals.__util = Util.current;
    response.locals.__url = request.originalUrl;
    response.locals.__isCurrentUrl = (url) => url == request.originalUrl;
    next();
});

app.use("/", require("./routes"));

app.listen(Config.current.env.port, function() {
    logger.info("[Server] Application started - Env: %s Port: %s", Config.current.env.name, Config.current.env.port);
});