const processor = require('./src/processor');
const { monkeypatch } = require('./src/utils');

module.exports = (_, options = {}) => {
  setImmediate(function() {
    const Eleventy = require('@11ty/eleventy');
    let firstRun = true;
    let isWatch = false;

    monkeypatch(Eleventy, async function watch(original) {
      isWatch = true;

      return await original.apply(this, arguments);
    });

    monkeypatch(Eleventy, async function write(original) {
      if (firstRun && !this.isDryRun) {
        await processor.call(this, options, isWatch);
      }

      firstRun = false;

      return await original.apply(this, arguments);
    });
  });
};
