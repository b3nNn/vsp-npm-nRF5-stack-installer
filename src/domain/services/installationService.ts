import * as _ from 'lodash';
import * as path from 'path';
import { InstallationServiceInterface } from '.';
import { InstallationAdapterInterface, OptionAdapterInterface } from '../adapters';
import { Registry } from '../registries';
import { LoggingContextInterface } from '../logging';
import { FileRepositoryInterface } from '../repositories';
import { InstallationConfigurationInterface } from '../configurations';

export class InstallationService implements InstallationServiceInterface {
    private logger: any;
    private cfx: any;
    private files: FileRepositoryInterface;
    private config: InstallationConfigurationInterface;

    public constructor(logging: LoggingContextInterface, configuration: InstallationConfigurationInterface, fileRepository: FileRepositoryInterface) {
        this.logger = logging.getConsole();
        this.cfx = logging.getChalk();
        this.files = fileRepository;
        this.config = configuration;
    }

    public async installRequirements(requirements: string[], installations: Registry<InstallationAdapterInterface>, options: Registry<OptionAdapterInterface>): Promise<number> {
        this.logger.log(this.cfx.white(`running from ${this.cfx.white.bold(this.files.getCwd())}`));

        if (this.validateRequirements(requirements, installations, options) != 0) {
            return -1;
        }

        if (this.prepare() != 0) {
            return -1;
        }

        if (await this.installAll(this.getInstallations(requirements, installations), this.getOptions(requirements, options)) != 0) {
            return -1;
        }

        if (this.cleanup() != 0) {
            return -1;
        }

        return 0;
    }

    private prepare(): number {
        const tmpDir = path.join(this.files.getCwd(), this.config.getTemporaryDirectory());
        var displayStatement = (isOk: boolean, err: string = null): void => {
            this.logger.log(this.cfx.white(`preparing installations\t${isOk ? this.cfx.green('ok') : this.cfx.red('ko')}`));
            if (err) {
                this.logger.log(this.cfx.red(`error: ${err}`));
            }
        };

        if (!this.files.exists(tmpDir) && this.files.createDirectory(tmpDir) != 0) {
            displayStatement(false, `temporary directory ${tmpDir} is not writable`);
            return -1;
        }

        return 0;
    }

    private cleanup(): number {
        const tmpDir = path.join(this.files.getCwd(), this.config.getTemporaryDirectory());
        var displayStatement = (isOk: boolean, err: string = null): void => {
            this.logger.log(this.cfx.white(`cleaning installations\t${isOk ? this.cfx.green('ok') : this.cfx.red('ko')}`));
            if (err) {
                this.logger.log(this.cfx.red(`error: ${err}`));
            }
        };

        if (this.files.exists(tmpDir) && this.files.delete(tmpDir) != 0) {
            displayStatement(false, `temporary directory ${tmpDir} is not deleteable`);
            return -1;
        } else if (this.files.exists(tmpDir)) {
            displayStatement(true);
        }

        return 0;
    }

    private validateRequirements(requirements: string[], installations: Registry<InstallationAdapterInterface>, options: Registry<OptionAdapterInterface>): number {
        var exists = [...installations.getAllRegistredNames(), ...options.getAllRegistredNames()];
        var missings = _.difference(requirements, exists);
        var displayStatement = (isOk: boolean, err: string = null): void => {
            this.logger.log(this.cfx.white(`validating requirements\t${isOk ? this.cfx.green('ok') : this.cfx.red('ko')}`));
            if (err) {
                this.logger.log(this.cfx.red(`error: ${err}`));
            }
        };

        if (requirements == null || requirements.length == 0) {
            displayStatement(false, 'nothing to install');
            return -1;
        } else if (missings.length > 0) {
            missings.forEach(name => {
                displayStatement(false, `${name} is not a valid ${this.cfx.red.bold('installation')} nor ${this.cfx.red.bold('option')}`);
            });
            return -1;
        } else {
            displayStatement(true);
        }

        return 0;
    }

    private async installAll(installations: InstallationAdapterInterface[], options: OptionAdapterInterface[]): Promise<number> {
        for (var it = 0; it < installations.length; it++) {
            if (await this.installSingle(installations[it], options) != 0) {
                return -1;
            }
        }
        return 0;
    }

    private async installSingle(installation: InstallationAdapterInterface, options: OptionAdapterInterface[]): Promise<number> {
        _.forEach(options, (opt: OptionAdapterInterface) => {
            installation.apply(opt);
        });

        return await installation.execute(this.config);
    }

    private getInstallations(requirements: string[], installations: Registry<InstallationAdapterInterface>): InstallationAdapterInterface[] {
        return _.reduce(requirements, (res: InstallationAdapterInterface[], name: string): InstallationAdapterInterface[] => {
            if (name.indexOf('--') == -1) {
                res.push(installations.get(name));
            }
            return res;
        }, []);
    }

    private getOptions(requirements: string[], options: Registry<OptionAdapterInterface>): OptionAdapterInterface[] {
        return _.reduce(requirements, (res: OptionAdapterInterface[], name: string): OptionAdapterInterface[] => {
            if (name.indexOf('--') == 0) {
                res.push(options.get(name));
            }
            return res;
        }, []);
    }
}

export function createInstallationService(logging: LoggingContextInterface, configuration: InstallationConfigurationInterface, fileRepository: FileRepositoryInterface) {
    return new InstallationService(logging, configuration, fileRepository);
}