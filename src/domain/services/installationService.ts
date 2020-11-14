import { InstallationServiceInterface } from '.';
import { InstallationAdapterInterface, OptionAdapterInterface } from '../adapters';
import { Registry } from '../registries/registry';
import { LoggingContextInterface } from '../logging';

export class InstallationService implements InstallationServiceInterface {
    private logger: any;
    private cfx: any;

    public constructor(logging: LoggingContextInterface) {
        this.logger = logging.getConsole();
        this.cfx = logging.getChalk();
    }

    public install(requirements: string[], installations: Registry<InstallationAdapterInterface>, options: Registry<OptionAdapterInterface>) {
        const installs: InstallationAdapterInterface[] = [];
        const opts: OptionAdapterInterface[] = [];

        requirements.forEach(name => {
            if (installations.existsByName(name)) {
                installs.push(installations.get(name));
                this.logger.log(this.cfx.white(`Installation found for ${this.cfx.white.bold(name)}`));
            } else if (options.existsByName(name)) {
                opts.push(options.get(name));
                this.logger.log(this.cfx.white(`Got option ${this.cfx.white.bold(name)}`));
            } else {
                this.logger.log(this.cfx.red(`Error: ${name} is not a valid ${this.cfx.red.bold('installation')} nor ${this.cfx.red.bold('option')}`));
            }
        });

        if ((installs.length + opts.length) == requirements.length) {
            installs.forEach(install => {
                this.logger.log(this.cfx.white(`Installing ${this.cfx.white.bold(install.getName())}`));
            });
        }
    }
}

export function createInstallationService(logging: LoggingContextInterface) {
    return new InstallationService(logging);
}