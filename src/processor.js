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
    minifyOptions: {},
    excludeNodeModules: true,
    excludeNonCssFiles: true
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

  const filePaths = await fg(options.src, {
    ignore: [
      options.dest,
      ...options.excludeNodeModules ? ['node_modules/**/*'] : [],
      ...options.excludeNonCssFiles ? ['**/!(*.css)'] : []
    ]
  });

  if (filePaths.length > 0) {
    await writer(filePaths, options);

    if (isWatch) {
      let watchFilePaths = filePaths.slice();
      let ignores = [];

      if (options.watchEleventyWatchTargets) {
        await elev.initWatch();

        watchFilePaths = watchFilePaths.concat(await elev.getWatchedFiles());
        ignores = ignores.concat(elev.eleventyFiles.getGlobWatcherIgnores());
      }

      if (options.configFile) {
        watchFilePaths.push(options.configFile);
      }

      const watcher = chokidar.watch(watchFilePaths, {
        ignored: ignores
      });

      watcher.on('change', (filePath) => {
        log('File changed: ' + filePath);

        writer(filePaths, options).then(() => {
          elev.eleventyServe.reload();

          log('Watching…');
        });
      });

      log('Watching…');
    }
  } else {
    log('No files matching the src option were found');
  }
};
