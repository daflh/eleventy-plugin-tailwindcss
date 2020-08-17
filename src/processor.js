const fs = require("fs");
const path = require('path');
const chokidar = require("chokidar");
const fg = require("fast-glob");
const writer = require("./writer");

module.exports = function (options, isWatch) {
    const elev = this;
    const inputDir = elev.inputDir;
    const outputDir = elev.outputDir;
    const defaultOptions = {
        src: path.join(inputDir, "**/*.css"),
        dest: ".",
        configFile: "./tailwind.config.js",
        excludeNodeModules: true,
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

    let excludeGlob = [options.dest, "**/!(*.css)"];
    if (options.excludeNodeModules) {
        excludeGlob.push("node_modules/**/*");
    }
    const fileNames = fg.sync(options.src, {
        ignore: excludeGlob
    });

    writer(fileNames, options).then(() => {
        if (isWatch) {
            const watcher = chokidar.watch(fileNames);
            watcher.on("change", (path) => {
                console.log("[TailwindCSS Plugin] File changed: " + path);
                writer(fileNames, options).then(() => {
                    elev.eleventyServe.reload();
                    console.log("Watching…");
                });
            });
        }
    });

};