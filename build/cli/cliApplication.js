"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCliApplication = exports.CliApplication = void 0;
const program = require("commander");
const registries_1 = require("../domain/registries");
const adapters_1 = require("./adapters");
class CliApplication {
    constructor(configuration, installService) {
        this.configuration = configuration;
        this.installations = new registries_1.Registry();
        this.options = new registries_1.Registry();
        this.installService = installService;
    }
    execute() {
        program
            .command('install [installation...]', { isDefault: true })
            .description('Install nRF5 toolchain with extra flavors')
            .option('--upgrade', 'Upgrade provided installations')
            .option('--reinstall', 'Reinstall provided installations')
            .action((_, opts) => {
            var _a;
            this.setupRegistries();
            this.installService.installRequirements((_a = opts.parent) === null || _a === void 0 ? void 0 : _a.args, this.installations, this.options);
        });
        program.parse(this.configuration.getArguments());
    }
    setupRegistries() {
        this.installations.register(new adapters_1.nRF52InstallationAdapter(this.installService));
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