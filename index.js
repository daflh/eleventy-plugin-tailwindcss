const Eleventy = require("@11ty/eleventy");
const shimmer = require("shimmer");
const processor = require("./src/processor");

module.exports = (__, options = {}) => {
    setImmediate(function () {
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