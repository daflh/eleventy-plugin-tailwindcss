const Eleventy = require("@11ty/eleventy");
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
        let firstWrite = true;

        monkeypatch(Eleventy, function write (original) {
            if (firstWrite && !this.isDryRun) {
                processor.call(this, options);
            }
            firstWrite = false;
            return original.apply(this, arguments);
        });

    });
}