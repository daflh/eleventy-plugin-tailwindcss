# Eleventy Plugin Tailwind CSS

[![npm version](https://badge.fury.io/js/eleventy-plugin-tailwindcss.svg)](https://www.npmjs.com/package/eleventy-plugin-tailwindcss)

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

You can also pass in options. For example, this will process the CSS file from `src/css/main.css` to `_site/assets/main.css`:
```javascript
// Input directory: src
// Output directory: _site
eleventyConfig.addPlugin(pluginTailwindCSS, {
    src: "src/css/main.css",
    dest: "assets",
    keepFolderStructure: false,
    minify: false
    // See below for other available options
});
```

## Options

### src
* Type: `string` | `string[]`
* Default:  *your input dir* + `"**/*.css"`

Paths (or glob patterns) to CSS files you want to process with Tailwind CSS, relative to the root of your project. To avoid any errors, we automatically exclude all files except those ending in `.css`.

> :book: We use [fast-glob](https://www.npmjs.com/package/fast-glob) as our low-level library for glob matching.

### dest
> New in v0.2.0
* Type: `string`
* Default: `.`

Where processed CSS files should be placed in the output folder.

Take a look at second example above, if you delete `dest` option, so that it returns to the default value (`.` which means right below the output folder), then the file will be placed at `_site/main.css` (Assuming your Eleventy output folder is `_site`).

### configFile
* Type: `string`
* Default: `tailwind.config.js`

Path to tailwind configuration file (if exists), relative to the root of your project.

### watchEleventyWatchTargets
> New in v0.2.5
* Type: `boolean`
* Default: `false`

In watch/serve mode with this option set to `false` (default), CSS will only rebuild when files in `src` option changes. However, if set to `true`, CSS will also rebuild when the files Eleventy watches changes, that includes your template files like `.html`, `.njk`, `.md`, etc. Useful when you want to use Tailwind's purge feature during development.

### keepFolderStructure
> New in v0.2.0
* Type: `boolean`
* Default: `true`

Indicates whether the input file folder structure will be preserved in the output.

Back to the second example again, if you set `keepFolderStructure` option to `true`, then the file will be placed at `_site/assets/css/main.css` (Assuming your Eleventy output folder is `_site`).

### autoprefixer
* Type: `boolean`
* Default: `true`

Indicates whether an output file should be added browser specific prefixes (like `-webkit` or `-moz`) if needed using [Autoprefixer](https://www.npmjs.com/package/autoprefixer).

### autoprefixerOptions
* Type: `object`
* Default: `{}`

Options to pass to Autoprefixer. See available options [here](https://github.com/postcss/autoprefixer#options).

### minify
* Type: `boolean`
* Default: `true`

Indicates whether an output file should be minified using [cleanCSS](https://www.npmjs.com/package/clean-css).

### minifyOptions
* Type: `object`
* Default: `{}`

Options to pass to cleanCSS. See available options [here](https://github.com/jakubpawlowicz/clean-css/tree/v4.2.1#constructor-options).

## License
MIT © Dafiul Haq
