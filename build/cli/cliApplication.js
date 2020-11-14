"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCliApplication = exports.CliApplication = void 0;
const program = require("commander");
const registry_1 = require("../domain/registries/registry");
const adapters_1 = require("./adapters");
const _ = require("lodash");
class CliApplication {
    constructor(configuration, installService) {
        this.configuration = configuration;
        this.installations = new registry_1.Registry();
        this.options = new registry_1.Registry();
        this.installService = installService;
    }
    execute() {
        program
            .description('Install nRF5 toolchain with extra flavors')
            .option('--nrf52', 'Nordic nRF52 SDK')
            .option('--gxepd2', 'Arduino GxEPD2 library')
            .option('--upgrade', 'Upgrade provided installations')
            .option('--reinstall', 'Reinstall provided installations')
            .action(() => {
            var requirements = _.reduce(this.configuration.getOptions(), (res, val) => {
                var name = val.slice(2);
                res.push(name);
                return res;
            }, []);
            this.setupRegistries();
            this.installService.install(requirements, this.installations, this.options);
        });
        program.parse(this.configuration.getArguments());
    }
    setupRegistries() {
        this.installations.register(new adapters_1.nRF52InstallationAdapter());
        this.options.register(new adapters_1.ReinstallOptionAdapter());
        this.options.register(new adapters_1.UpgradeOptionAdapter());
    }
}
exports.CliApplication = CliApplication;
function createCliApplication(configuration, installService) {
    return new CliApplication(configuration, installService);
}
exports.createCliApplication = createCliApplication;
//# sourceMappingURL=cliApplication.js.map