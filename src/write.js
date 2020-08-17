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
        dest: ".",
        configFile: "./tailwind.config.js",
        autoprefixer: true,
        autoprefixerOptions: {},
        minify: true,
        minifyOptions: {}
    }

    options = { ...defaultOptions, ...options };
    options.dest = path.join(outputDir, options.dest);
    if (!fs.existsSync(options.configFile)) {
        options.configFile = undefined;
    }

    compileCSS(options).then(() => {
        if (isWatch) {
            const watcher = chokidar.watch(options.src, {
                ignored: options.dest
            });
            watcher.on("change", () => {
                compileCSS(options).then(() => {
                    elev.eleventyServe.reload();
                    console.log("Watching…");
                });
            });
        }
    });

};