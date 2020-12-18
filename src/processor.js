const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const fg = require('fast-glob');
const writer = require('./writer');
const { log } = require('./utils');

module.exports = async function(userOptions, isWatch) {
  const elev = this;
  const inputDir = elev.inputDir;
  const outputDir = elev.outputDir;
  const defaultOptions = {
    src: path.posix.join(inputDir, '**/*.css'),
    dest: '.',
    configFile: 'tailwind.config.js',
    watchEleventyWatchTargets: false,
    keepFolderStructure: true,
    autoprefixer: true,
    autoprefixerOptions: {},
    minify: true,
    minifyOptions: {}
  };

  const options = {
    ...defaultOptions,
    ...userOptions,
    inputDir,
    outputDir
  };

  options.dest = path.join(outputDir, options.dest);

  if (!fs.existsSync(options.configFile)) {
    options.configFile = null;

    if ('configFile' in userOptions) {
      log('Tailwind config file not found at ' + userOptions.configFile, true);
      return;
    }
  } else {
    log('Using ' + options.configFile + ' as Tailwind config file');
  }

  let watchList = await fg(options.src, {
    ignore: [options.dest, 'node_modules/**/*', '**/!(*.css)']
  });
  const fileNames = watchList.map((src) => {
    const baseName = path.basename(src);
    let subDir = '';

    if (options.keepFolderStructure) {
      const pathToFile = path.relative(options.inputDir, path.dirname(src));

      if (pathToFile !== '') {
        subDir = pathToFile.replace(/^\.\.\/?/, '');
      }
    }

    const dest = path.join(options.dest, subDir, baseName);

    return [src, dest];
  });

  await writer(fileNames, options);

  if (isWatch) {
    let ignores = [];

    if (options.watchEleventyWatchTargets) {
      await this.initWatch();

      watchList = watchList.concat(await this.getWatchedFiles());
      ignores = ignores.concat(this.eleventyFiles.getGlobWatcherIgnores());
    }

    if (options.configFile) {
      watchList.push(options.configFile);
    }

    const watcher = chokidar.watch(watchList, {
      ignored: ignores
    });

    watcher.on('change', (path) => {
      log('File changed: ' + path);

      writer(fileNames, options).then(() => {
        elev.eleventyServe.reload();

        log('Watching…');
      });
    });

    log('Watching…');
  }
};
