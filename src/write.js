const fs = require("fs");
const path = require('path');
const chokidar = require("chokidar");
const compileCSS = require("./compile");

module.exports = function (options, isWatch) {
    const elev = this;
    const inputDir = elev.inputDir;
    const outputDir = elev.outputDir;
    const defaultOptions = {
        src: path.join(inputDir, "**/*.css"),
        dest: outputDir,
        configFile: "tailwind.config.js",
        autoprefixer: true,
        autoprefixerOptions: {},
        minify: true,
        minifyOptions: {}
    }

    options = { ...defaultOptions, ...options };
    if (!fs.existsSync(options.configFile)) {
        options.configFile = undefined;
    }

    compileCSS(options).then(() => {
        if (isWatch) {
            const watcher = chokidar.watch(options.src);
            watcher.on("change", () => {
                compileCSS(options).then(() => {
                    elev.eleventyServe.reload();
                    console.log("Watching…");
                });
            });
        }
    });

};