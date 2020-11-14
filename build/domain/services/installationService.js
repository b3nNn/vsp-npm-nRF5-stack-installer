"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInstallationService = exports.InstallationService = void 0;
class InstallationService {
    constructor(logging) {
        this.logger = logging.getConsole();
        this.cfx = logging.getChalk();
    }
    install(requirements, installations, options) {
        const installs = [];
        const opts = [];
        if (requirements == null || requirements.length == 0) {
            this.logger.log(this.cfx.red(`Error: nothing to install.`));
            return -1;
        }
        requirements.forEach(name => {
            if (installations.existsByName(name)) {
                installs.push(installations.get(name));
                this.logger.log(this.cfx.white(`Installation found for ${this.cfx.white.bold(name)}`));
            }
            else if (options.existsByName(name)) {
                opts.push(options.get(name));
                this.logger.log(this.cfx.white(`Got option ${this.cfx.white.bold(name)}`));
            }
            else {
                this.logger.log(this.cfx.red(`Error: ${name} is not a valid ${this.cfx.red.bold('installation')} nor ${this.cfx.red.bold('option')}`));
            }
        });
        if ((installs.length + opts.length) == requirements.length) {
            installs.forEach(install => {
                this.logger.log(this.cfx.white(`Installing ${this.cfx.white.bold(install.getName())}`));
            });
            return 0;
        }
        return -1;
    }
}
exports.InstallationService = InstallationService;
function createInstallationService(logging) {
    return new InstallationService(logging);
}
exports.createInstallationService = createInstallationService;
//# sourceMappingURL=installationService.js.map