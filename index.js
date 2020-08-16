const path = require("path");
const fs = require("fs");
const vfs = require("vinyl-fs");
const shimmer = require("shimmer");
const chokidar = require("chokidar");
const chalk  = require("chalk");
const onlyIf = require("gulp-if");
const postcss = require("gulp-postcss");
const cleanCSS = require("gulp-clean-css");
const autoprefixer = require("autoprefixer");
const tailwindcss = require('tailwindcss');

const pluginName = `[${chalk.blue("EleventyPluginTailwindCSS")}]`;

module.exports = {
    initArguments: {},
    configFunction: (__, options = {}) => {
        setImmediate(function () {
            const Eleventy = require("@11ty/eleventy");
            const inputDir = new Eleventy().inputDir;
            const outputDir = new Eleventy().outputDir;
            const defaultOptions = {
                src: path.join(inputDir, "**/*.css"),
                configFile: "./tailwind.config.js",
                autoprefixer: true,
                autoprefixerOptions: {},
                minify: true,
                minifyOptions: {}
            };
            options = { ...defaultOptions, ...options };
            
            let initialized = false;

            function compile () {
                return new Promise((resolve) => {
                    console.log(`${pluginName} Start compiling`);
                    if (!fs.existsSync(options.configFile)) {
                        options.configFile = undefined;
                    }
                    vfs.src(options.src)
                        .pipe(postcss([
                            tailwindcss(options.configFile),
                            ...options.autoprefixer ? [autoprefixer(options.autoprefixerOptions)] : []
                        ]))
                        .pipe(onlyIf(options.minify, cleanCSS(options.minifyOptions)))
                        .pipe(vfs.dest(outputDir))
                        .on("end", function () {
                            console.log(`${pluginName} Compiled successfully`);
                            resolve();
                        });
                });
            }

            shimmer.wrap(Eleventy.prototype, "write", function (original) {
                return function () {
                    if (!initialized && !this.isDryRun) {
                        initialized = true;
                        compile();
                    }
                    return original.apply(this, arguments);
                }
            });

            shimmer.wrap(Eleventy.prototype, "watch", function (original) {
                return function () {
                    if (!initialized && !this.isDryRun) {
                        initialized = true;
                        compile().then(() => {
                            console.log(`${pluginName} Watching...`);
                        });
                        const elev = this;
                        let watcher = chokidar.watch(options.src);
                        watcher.on("change", () => {
                            compile().then(() => {
                                console.log(`${pluginName} Watching...`);
                                elev.eleventyServe.reload();
                            });
                        });
                    }
                    return original.apply(this, arguments);
                }
            });

        });
    }
}