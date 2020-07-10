const path = require("path");
const vfs = require("vinyl-fs");
const shimmer = require("shimmer");
const chokidar = require("chokidar");
const chalk  = require("chalk");
const when = require("gulp-if");
const postcss = require("gulp-postcss");
const cleanCSS = require("gulp-clean-css");
const autoprefixer = require("autoprefixer");
const tailwindcss = require('tailwindcss');

const logBefore = `[${chalk.blue("EleventyPluginTailwindCSS")}]`;

module.exports = {
    initArguments: {},
    configFunction: (eleventyConfig, options = {}) => {
        setImmediate(function () {
            const Eleventy = require("@11ty/eleventy");
            const inputDir = new Eleventy().inputDir;
            const outputDir = new Eleventy().outputDir;
            const defaultOptions = {
                src: path.join(inputDir, "**/*.css"),
                dest: "",
                configFile: "./tailwind.config.js",
                autoprefixer: true,
                autoprefixerOptions: {},
                minify: true,
                minifyOptions: {}
            };
            options = { ...defaultOptions, ...options };
            
            let initialized = false;

            function compile (cb = () => {}) {
                console.log(`${logBefore} Start compiling`);
                vfs.src(options.src)
                    .pipe(postcss([
                        tailwindcss(options.configFile),
                        ...options.autoprefixer ? [autoprefixer(options.autoprefixerOptions)] : []
                    ]))
                    .pipe(when(options.minify, cleanCSS(options.minifyOptions)))
                    .pipe(vfs.dest(path.join(outputDir, options.dest)))
                    .on("end", function () {
                        console.log(`${logBefore} Compiled successfully`);
                        cb();
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
                        compile(() => {
                            console.log(`${logBefore} Watching...`);
                        });
                        const elev = this;
                        let watcher = chokidar.watch(options.src);
                        watcher.on("change", () => {
                            compile(function () {
                                console.log(`${logBefore} Watching...`);
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