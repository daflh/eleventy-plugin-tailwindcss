const shimmer = require("shimmer");
const processor = require("./src/processor");

module.exports = {
    initArguments: {},
    configFunction: (__, options = {}) => {
        setImmediate(function () {
            const Eleventy = require("@11ty/eleventy");
            shimmer.wrap(Eleventy.prototype, "write", function (original) {
                return function () {
                    if (!this.isDryRun) {
                        processor.call(this, options);
                    }
                    shimmer.unwrap(this, "write");
                    return original.apply(this, arguments);
                }
            });

        });
    }
}
