
const chalk = require('chalk');
const nrf52 = require('./lib/nrf52');
const program = require('commander');
const _ = require('lodash');

const installs = [
    nrf52
];

const ctx = {
    log : console.log,
    chalk
};

program
.description('Install nRF5 toolchain with extra flavors') // command description
.option('--nrf52', 'Nordic nRF52 SDK')
.option('--gxepd2', 'Arduino GxEPD2 library')
// function to execute when command is uses
.action(function (coffeeType, _) {
    ctx.log(ctx.chalk.white.bold('Hello world!'));
    ctx.log(coffeeType);
});


// allow commander to parse `process.argv`
// program.parse(process.argv);

console.log(_.reduce(process.argv, (res, val) => {
    if (val.indexOf('--') == 0 && !_.includes(res, val)) {
        res.push(val);
    }
    return res;
}, []));
