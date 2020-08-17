const Eleventy = require("@11ty/eleventy");
const shimmer = require("shimmer");
const processor = require("./src/processor");

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
                        processor.call(this, options, isWatch);
                    }
                    shimmer.massUnwrap(this, ["watch", "write"]);
                    return original.apply(this, arguments);
                }
            });

        });
    }
}