const pluginTailwind = require("../index");

module.exports = (eleventyConfig) => {

    eleventyConfig.addPassthroughCopy({ "sample/assets/*.js": "." });

    eleventyConfig.addPlugin(pluginTailwind, {
        src: ["**/*"],
        dest: ".",
        configFile: "sample/tailwind.config.js",
        watchEleventyWatchTargets: true,
        keepFolderStructure: false,
        autoprefixer: true,
        autoprefixerOptions: {},
        minify: true,
        minifyOptions: {}
    });

}
