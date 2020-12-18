const fs = require('fs');
const path = require('path');
const util = require('util');
const mkdirp = require('mkdirp');
const postcss = require('postcss');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');
const CleanCSS = require('clean-css');
const { log } = require('./utils');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

module.exports = async function(fileNames, options) {
  try {
    const postcssPlugins = [
      ...options.configFile ? [tailwindcss(options.configFile)] : [tailwindcss()],
      ...options.autoprefixer ? [autoprefixer(options.autoprefixerOptions)] : []
    ];

    for (const [src, dest] of fileNames) {
      const rawFile = await readFile(src);
      let { css: processedFile } = await postcss(postcssPlugins).process(rawFile, {
        from: src,
        to: dest
      });

      if (options.minify) {
        processedFile = new CleanCSS(options.minifyOptions).minify(processedFile).styles;
      }

      await mkdirp(path.dirname(dest));
      await writeFile(dest, processedFile);

      log(`Wrote ${dest} from ${src}`);
    }
  } catch (error) {
    log(error, true);
  }
};
