const fs = require("fs");
const path = require("path");
const util = require("util");
const mkdirp = require("mkdirp");
const postcss = require("postcss");
const tailwindcss = require("tailwindcss");
const autoprefixer = require("autoprefixer");
const CleanCSS = require("clean-css");
const log = require("./log");

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

module.exports = async function (fileNames, options) {
    try {
        const postcssPlugins = [
            tailwindcss(options.configFile),
            ...options.autoprefixer ? [autoprefixer(options.autoprefixerOptions)] : []
        ];
    
        for (let fileName of fileNames) {
            let baseName = path.basename(fileName);
            let dest = path.join(options.dest, baseName);
            let file = await readFile(fileName);
    
            let postcssResult = await postcss(postcssPlugins).process(file, {
                from: fileName,
                to: dest
            });
    
            let finalResult;
            if (options.minify) {
                finalResult = new CleanCSS(options.minifyOptions).minify(postcssResult.css).styles;
            } else {
                finalResult = postcssResult.css;
            }
    
            mkdirp.sync(path.dirname(dest));
            await writeFile(dest, finalResult);

            log(`Wrote ${dest} from ${fileName}`);
        }

    } catch (error) {
        console.log(error);
    }
}