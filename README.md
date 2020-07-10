# eleventy-plugin-tailwindcss
An [Eleventy](https://www.11ty.dev/) plugin to add [Tailwind CSS](https://tailwindcss.com/) support for your website.

## Installation
Available on [npm](https://www.npmjs.com/package/eleventy-plugin-tailwindcss).

```bash
npm install --save eleventy-plugin-tailwindcss
```

## Usage
Open up your Eleventy config file (probably `.eleventy.js`) and add the plugin like so:

```javascript
const pluginTailwindCSS = require("eleventy-plugin-tailwindcss");
module.exports = function(eleventyConfig) {
    eleventyConfig.addPlugin(pluginTailwindCSS);
};
```

You can also pass in options, for example:
```javascript
eleventyConfig.addPlugin(pluginTailwindCSS, {
    src: "./src/main.css",
    minify: false
    // See below for other options
});
```

## Options
Available options are:
- `src` (default: *your input dir* + `"**/*.css"`) - Glob (or array of globs) to specify the location of the CSS file you want to process with Tailwind CSS, **relative to the root** of your project.
- `configFile` (default: `"./tailwind.config.js"`) - Path to tailwind configuration file (if exists), relative to the root of your project.
- `autoprefixer` (default: `true`) - Controls whether an output file should be added browser specific prefixes (like `-webkit` or `-moz`) if needed using [Autoprefixer](https://www.npmjs.com/package/autoprefixer).
- `minify` (default: `true`) - Controls whether an output file should be minified using [cleanCSS](https://www.npmjs.com/package/clean-css).
- `autoprefixerOptions` (default: `{}`) - Options to pass to Autoprefixer. See available options [here](https://github.com/postcss/autoprefixer#options).
- `minifyOptions` (default: `{}`) - Options to pass to cleanCSS. See available options [here](https://github.com/jakubpawlowicz/clean-css/tree/v4.2.1#constructor-options).

## License
MIT © Dafiul Haq