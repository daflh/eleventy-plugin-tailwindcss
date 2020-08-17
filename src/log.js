const chalk = require('chalk');

module.exports = (msg) => {
    const pluginName = chalk.blue("TailwindCSS Plugin");
    console.log(`[${pluginName}] ${msg}`);
}