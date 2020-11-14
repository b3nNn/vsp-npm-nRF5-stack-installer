"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCliApplication = exports.CliApplication = void 0;
const models_1 = require("../domain/models");
const program = require("commander");
class CliApplication {
    constructor(configuration, logging) {
        this.configuration = configuration;
        this.logger = logging.getConsole();
        this.cfx = logging.getChalk();
        this.registry = models_1.createInstallationProcedureRegistry();
    }
    execute() {
        program
            .description('Install nRF5 toolchain with extra flavors')
            .option('--nrf52', 'Nordic nRF52 SDK')
            .option('--gxepd2', 'Arduino GxEPD2 library')
            .action(() => {
            this.logger.log(this.cfx.white.bold('Hello world!'));
            this.logger.log(this.configuration.getOptions());
            this.configuration.getOptions().forEach(val => {
                var name = val.slice(2);
                if (this.registry.existsByName(name)) {
                    this.logger.log(this.cfx.white.bold(`Installing ${val.slice(2)}`));
                }
                else {
                    this.logger.log(this.cfx.red.bold(`Failed to install ${val.slice(2)}`));
                }
            });
        });
        program.parse(this.configuration.getArguments());
    }
}
exports.CliApplication = CliApplication;
function createCliApplication(configuration, context) {
    return new CliApplication(configuration, context);
}
exports.createCliApplication = createCliApplication;
//# sourceMappingURL=cliApplication.js.map