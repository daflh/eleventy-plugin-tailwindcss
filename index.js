const processor = require("./src/processor");
const { monkeypatch } = require("./src/utils");

module.exports = (__, options = {}) => {
    setImmediate(function () {
        const Eleventy = require("@11ty/eleventy");
        let firstRun = true;
        let isWatch = false;

        monkeypatch(Eleventy, function watch (original) {
            isWatch = true;
            return original.apply(this, arguments);
        });

        monkeypatch(Eleventy, function write (original) {
            if (firstRun && !this.isDryRun) {
                processor.call(this, options, isWatch);
            }
            firstRun = false;
            return original.apply(this, arguments);
        });

    });
}
