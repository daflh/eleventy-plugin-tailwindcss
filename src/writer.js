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

module.exports = async function(filePaths, options) {
  try {
    const postcssPlugins = [
      ...options.configFile ? [tailwindcss(options.configFile)] : [tailwindcss()],
      ...options.autoprefixer ? [autoprefixer(options.autoprefixerOptions)] : []
    ];
    const getDest = (src) => {
      const baseName = path.basename(src);
      let subDir = '';

      if (options.keepFolderStructure) {
        const pathToFile = path.relative(options.inputDir, path.dirname(src));

        if (pathToFile !== '') {
          subDir = pathToFile.replace(/^\.\.\/?/, '');
        }
      }

      return path.join(options.dest, subDir, baseName);
    };

    for (const src of filePaths) {
      const dest = getDest(src);
      let content = await readFile(src);
      content = (await postcss(postcssPlugins).process(content, {
        from: src,
        to: dest
      })).css;

      if (options.minify) {
        content = new CleanCSS(options.minifyOptions).minify(content).styles;
      }

      await mkdirp(path.dirname(dest));
      await writeFile(dest, content);

      log(`Wrote ${dest} from ${src}`);
    }
  } catch (error) {
    log(error, true);
  }
};
