const processor = require("./src/processor");

function monkeypatch(cls, fn) {
    const orig = cls.prototype[fn.name].__original || cls.prototype[fn.name];
    function wrapped() {
        return fn.bind(this, orig).apply(this, arguments);
    }
    wrapped.__original = orig;
  
    cls.prototype[fn.name] = wrapped;
}

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
