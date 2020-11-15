import * as _ from 'lodash';
import * as path from 'path';
import * as dlhelper from 'node-downloader-helper';
import * as anzip from 'anzip';
import { InstallationServiceInterface, InstallationAdapterServiceInterface } from '.';
import { InstallationAdapterInterface, OptionAdapterInterface } from '../adapters';
import { Registry } from '../registries';
import { LoggingContextInterface } from '../logging';
import { FileRepositoryInterface } from '../repositories';
import { InstallationConfigurationInterface } from '../configurations';

export class InstallationService implements InstallationServiceInterface, InstallationAdapterServiceInterface {
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

        return 0;
    }

    public prepareTemporaryFolder(installation: InstallationAdapterInterface): string {
        const tmpDir = path.join(this.files.getCwd(), this.config.getTemporaryDirectory(), installation.getName());
        var displayStatement = (isOk: boolean, err: string = null): void => {
            this.logger.log(this.cfx.white(`preparing ${this.cfx.white.bold(installation.getName())} temporary folder\t${isOk ? this.cfx.green('ok') : this.cfx.red('ko')}`));
            if (err) {
                this.logger.log(this.cfx.red(`error: ${err}`));
            }
        };

        if (!this.files.exists(tmpDir) && this.files.createDirectory(tmpDir) != 0) {
            displayStatement(false, `installation temporary directory ${tmpDir} is not writable`);
            return null;
        }

        displayStatement(true);
        return tmpDir;
    }

    public terminate(installation: InstallationAdapterInterface, error: string = null): void {
        if (error == null) {
            this.logger.log(this.cfx.green(`${this.cfx.green.bold(installation.getName())} installation succeded`));
        } else {
            this.logger.log(this.cfx.red(`${this.cfx.red.bold(installation.getName())} installation failed`));
            this.logger.log(this.cfx.red(`error: ${error}`));
        }
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

    public download(installation: InstallationAdapterInterface, name: string, url: string): Promise<dlhelper.DownloadInfo> {
        return new Promise<dlhelper.DownloadInfo>((resolve, reject) => {
            const tmpDir = path.join(this.files.getCwd(), this.config.getTemporaryDirectory(), installation.getName());
            const dl = new dlhelper.DownloaderHelper(url, tmpDir);
            var displayStatement = (isOk: boolean, err: string = null): void => {
                this.logger.log(this.cfx.white(`downloading ${name}\t${isOk ? this.cfx.green('ok') : this.cfx.red('ko')}`));
                if (err) {
                    this.logger.log(this.cfx.red(`error: ${err}`));
                }
            };

            dl.on('download', () => {
                this.logger.log(this.cfx.white(`downloading ${name}...`));
            });
            dl.on('end', (downloadInfo: any) => {
                displayStatement(true);
                resolve(downloadInfo);
            });
            dl.on('error', error => {
                displayStatement(false, `not able to download content from '${url}'`);
                reject(error);
            });
            dl.start();
        });
    }

    public unzipDownload(installation: InstallationAdapterInterface, name: string, downloadInfo: dlhelper.DownloadInfo): Promise<string[]> {
        return new Promise<string[]>(async (resolve, reject) => {
            const tmpDir = path.join(this.files.getCwd(), this.config.getTemporaryDirectory(), installation.getName());
            var displayStatement = (isOk: boolean, err: string = null): void => {
                this.logger.log(this.cfx.white(`uncompressing ${name}\t${isOk ? this.cfx.green('ok') : this.cfx.red('ko')}`));
                if (err) {
                    this.logger.log(this.cfx.red(`error: ${err}`));
                }
            };

            this.logger.log(this.cfx.white(`uncompressing ${name}...`));

            try {
                const output = await anzip(`${downloadInfo.filePath}`, {
                    outputPath: tmpDir
                });
                var results: string[] = _.reduce(output.files, (res: string[], val: any): string[] => {
                    var rootDir = path.join(tmpDir, val.directory.split(path.sep).shift());
                    if (!_.includes(res, rootDir)) {
                        res.push(rootDir);
                    }
                    return res;
                }, []);
                displayStatement(true);
                resolve(results);
            } catch(e) {
                displayStatement(false, `not able to unzip the archive '${downloadInfo.filePath}'`);
                reject(e);
            }
        });
    }

    public copyToInstallationFolder(name: string, paths: string[]): Promise<string[]> {
        return new Promise<string[]>((resolve, reject) => {
            const rootDir = path.join(this.files.getCwd(), this.config.getRootDirectory());
            var displayStatement = (isOk: boolean, err: string = null): void => {
                this.logger.log(this.cfx.white(`copying ${name}\t${isOk ? this.cfx.green('ok') : this.cfx.red('ko')}`));
                if (err) {
                    this.logger.log(this.cfx.red(`error: ${err}`));
                }
            };

            this.logger.log(this.cfx.white(`copying ${name}...`));

            for (var it = 0; it < paths.length; it++) {
                var current = paths[it];

                if (this.files.copy(current, rootDir) != 0) {
                    displayStatement(false, `not able to copy the source '${current}' into '${rootDir}'`);
                    reject(null);
                    return;
                }
            }
            
            displayStatement(true);
            resolve(paths);
        });
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