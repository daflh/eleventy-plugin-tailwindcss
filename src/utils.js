function monkeypatch(cls, fn) {
  const orig = cls.prototype[fn.name].__original || cls.prototype[fn.name];

  function wrapped() {
    return fn.bind(this, orig).apply(this, arguments);
  }

  wrapped.__original = orig;

  cls.prototype[fn.name] = wrapped;
}

function log(msg, isError) {
  if (isError) {
    msg = '\u001b[31mError!\u001b[39m ' + msg;
  }

  const pluginName = 'Eleventy-Plugin-TailwindCSS';

  console.log(`[\x1b[34m${pluginName}\x1b[0m] ${msg}`);
}

module.exports = {
  monkeypatch,
  log
};
