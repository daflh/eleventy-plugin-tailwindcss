const fs = require("fs");
const path = require('path');
const chokidar = require("chokidar");
const fg = require("fast-glob");
const writer = require("./writer");
const { log } = require("./utils");

module.exports = async function (options, isWatch) {
    const elev = this;
    const inputDir = elev.inputDir;
    const outputDir = elev.outputDir;
    const defaultOptions = {
        src: path.join(inputDir, "**/*.css"),
        dest: ".",
        configFile: "tailwind.config.js",
        watchEleventyWatchTargets: false,
        keepFolderStructure: true,
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

    let excludeGlob = [options.dest, "**/!(*.css)", "node_modules/**/*"];

    let watchList = await fg(options.src, {
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

    await writer(fileNames, options);
    
    if (isWatch) {
        let ignores = [];
        if (options.watchEleventyWatchTargets) {
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

        log("Watching…");

    }

};