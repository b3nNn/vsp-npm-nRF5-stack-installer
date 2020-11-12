const shell = require('shelljs');

const install = function(ctx, options) {
    ctx.log(ctx.chalk.white.bold('Hello world!'));
};

module.exports = install;