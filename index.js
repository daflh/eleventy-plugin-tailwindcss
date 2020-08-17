const Eleventy = require("@11ty/eleventy");
const shimmer = require("shimmer");
const writeCSS = require("./src/write");

module.exports = {
    initArguments: {},
    configFunction: (__, options = {}) => {
        setImmediate(function () {
            let isWatch = false;

            shimmer.wrap(Eleventy.prototype, "watch", function (original) {
                return function () {
                    isWatch = true;
                    return original.apply(this, arguments);
                }
            });

            shimmer.wrap(Eleventy.prototype, "write", function (original) {
                return function () {
                    if (!this.isDryRun) {
                        writeCSS.call(this, options, isWatch);
                    }
                    shimmer.massUnwrap(this, ["watch", "write"]);
                    return original.apply(this, arguments);
                }
            });

        });
    }
}