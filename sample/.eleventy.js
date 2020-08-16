const pluginTailwind = require("../index");

module.exports = (eleventyConfig) => {

    eleventyConfig.addPlugin(pluginTailwind, {
        src: "sample/main.css",
        configFile: "",
        autoprefixer: false,
        minify: false
    });

}
