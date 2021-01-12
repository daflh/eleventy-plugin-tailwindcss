const pluginTailwind = require('../');

module.exports = (eleventyConfig) => {
  eleventyConfig.addPassthroughCopy({ 'sample/assets/*.js': '.' });

  eleventyConfig.addPlugin(pluginTailwind, {
    src: ['**/*'],
    dest: '.',
    configFile: 'sample/tailwind.config.js',
    watchEleventyWatchTargets: false,
    keepFolderStructure: false,
    autoprefixer: true,
    autoprefixerOptions: {},
    minify: true,
    minifyOptions: {}
  });
};
