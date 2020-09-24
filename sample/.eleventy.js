const pluginTailwind = require("../index");

module.exports = (eleventyConfig) => {

    eleventyConfig.addPassthroughCopy({ "sample/assets/*.js": "." });

    eleventyConfig.addPlugin(pluginTailwind, {
        src: ["**/*"],
        watchEleventyFile: true,
        excludeNodeModules: true,
        dest: ".",
        keepFolderStructure: false,
        configFile: "sample/tailwind.config.js",
        autoprefixer: true,
        autoprefixerOptions: {},
        minify: true,
        minifyOptions: {}
    });

}
