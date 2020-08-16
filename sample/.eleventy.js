const pluginTailwind = require("../index");

module.exports = (eleventyConfig) => {

    eleventyConfig.addPassthroughCopy({ "sample/assets/*.js": "." });

    eleventyConfig.addPlugin(pluginTailwind, {
        src: "sample/assets/style.css",
        configFile: "",
        autoprefixer: false,
        minify: false
    });

}
