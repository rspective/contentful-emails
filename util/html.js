var Chance      = require("chance");
var swig        = require("swig");
var util        = require("util");
var path        = require("path");

var Config      = require("./../config"); 
var FormatUtil  = require("./format");

class HtmlUtil {
    constructor(config = Config.current) {
        this.config = config;
    }
    render(template, context = {}) {
        var templateInViews   = path.join(config.paths.views, template);
        context.__format = new FormatUtil(this.config);
        context.__config = this.config;
        context.__viewsPath = this.config.paths.views;
        context.__template = template;
        return swig.renderFile(templateInViews, context);
    }
    renderPlain(templatePlain, tempateBasePath = "", context = {}) {
        var config = new Config(context);
        context.__format = new FormatUtil(this.config);
        context.__config = this.config;
        context.__viewsPath = this.config.paths.views;
        return swig.render(
            templatePlain, {
                locals  : context, 
                cache   : false, 
                filename: path.join(config.paths.views, util.format("%s/%s.html", tempateBasePath, new Chance().hash({ length: 50 })))
            });
    }
}

HtmlUtil.current = new HtmlUtil();

module.exports  = HtmlUtil;