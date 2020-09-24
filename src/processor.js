const fs = require("fs");
const path = require('path');
const chokidar = require("chokidar");
const fg = require("fast-glob");
const writer = require("./writer");
const { log } = require("./utils");

module.exports = function (options, isWatch) {
    const elev = this;
    const inputDir = elev.inputDir;
    const outputDir = elev.outputDir;
    const defaultOptions = {
        src: path.join(inputDir, "**/*.css"),
        watchEleventyFile: false,
        excludeNodeModules: true,
        dest: ".",
        keepFolderStructure: true,
        configFile: "tailwind.config.js",
        autoprefixer: true,
        autoprefixerOptions: {},
        minify: true,
        minifyOptions: {}
    }

    options = { ...defaultOptions, ...options, inputDir, outputDir };
    options.dest = path.join(outputDir, options.dest);
    if (!fs.existsSync(options.configFile)) {
        options.configFile = undefined;
    } else {
        log("Using " + options.configFile + " as configuration file");
    }

    let excludeGlob = [options.dest, "**/!(*.css)"];
    if (options.excludeNodeModules) {
        excludeGlob.push("node_modules/**/*");
    }

    let watchList = fg.sync(options.src, {
        ignore: excludeGlob
    });
    
    const fileNames = watchList.map((src) => {
        let baseName = path.basename(src);
        let subDir = "";
        if (options.keepFolderStructure) {
            let pathToFile = path.relative(options.inputDir, path.dirname(src));
            if (pathToFile !== "") {
                subDir = pathToFile.replace(/^\.\.\/?/, "");
            }
        }
        let dest = path.join(options.dest, subDir, baseName);
        return [src, dest];
    });

    writer(fileNames, options).then(async () => {
        if (isWatch) {
            let ignores = [];
            if (options.watchEleventyFile) {
                await this.initWatch();
                watchList = watchList.concat(await this.getWatchedFiles());
                ignores = ignores.concat(this.eleventyFiles.getGlobWatcherIgnores());
            }
            const watcher = chokidar.watch(watchList, {
                ignored: ignores
            });
            watcher.on("change", (path) => {
                log("File changed: " + path);
                writer(fileNames, options).then(() => {
                    elev.eleventyServe.reload();
                    log("Watching…");
                });
            });
        }
    });

};