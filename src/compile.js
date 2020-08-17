const vfs = require("vinyl-fs");
const onlyIf = require("gulp-if");
const postcss = require("gulp-postcss");
const cleanCSS = require("gulp-clean-css");
const autoprefixer = require("autoprefixer");
const tailwindcss = require('tailwindcss');

module.exports = function (options) {
    return new Promise((resolve) => {
        console.log("Start compiling TailwindCSS");

        vfs.src(options.src)
        .pipe(postcss([
            tailwindcss(options.configFile),
            ...options.autoprefixer ? [autoprefixer(options.autoprefixerOptions)] : []
        ]))
        .pipe(onlyIf(options.minify, cleanCSS(options.minifyOptions)))
        .pipe(vfs.dest(options.dest))
        .on("end", () => {
            console.log("TailwindCSS compiled successfully");
            resolve();
        });

    });
}