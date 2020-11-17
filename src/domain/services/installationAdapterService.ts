import * as _ from 'lodash';
import * as path from 'path';
import * as dlhelper from 'node-downloader-helper';
import * as anzip from 'anzip';
import { InstallationAdapterServiceInterface } from '.';
import { InstallationAdapterInterface } from '../adapters';
import { LoggingContextInterface } from '../logging';
import { FileRepositoryInterface } from '../repositories';
import { InstallationConfigurationInterface } from '../configurations';

export class InstallationAdapterService implements InstallationAdapterServiceInterface {
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

    public download(installation: InstallationAdapterInterface, url: string): Promise<dlhelper.DownloadInfo> {
        const name = installation.getName();

        return new Promise<dlhelper.DownloadInfo>((resolve, reject) => {
            const tmpDir = path.join(this.files.getCwd(), this.config.getTemporaryDirectory(), installation.getName());
            const dl = new dlhelper.DownloaderHelper(url, tmpDir);
            var displayStatement = (isOk: boolean, err: string = null): void => {
                this.logger.log(this.cfx.white(`downloading ${this.cfx.white.bold(name)}\t${isOk ? this.cfx.green('ok') : this.cfx.red('ko')}`));
                if (err) {
                    this.logger.log(this.cfx.red(`error: ${err}`));
                }
            };

            dl.on('download', () => {
                this.logger.log(this.cfx.white(`downloading ${this.cfx.white.bold(name)}...`));
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

    public unzipDownload(installation: InstallationAdapterInterface, downloadInfo: dlhelper.DownloadInfo): Promise<string[]> {
        const name = installation.getName();

        return new Promise<string[]>(async (resolve, reject) => {
            const tmpDir = path.join(this.files.getCwd(), this.config.getTemporaryDirectory(), installation.getName());
            var displayStatement = (isOk: boolean, err: string = null): void => {
                this.logger.log(this.cfx.white(`uncompressing ${this.cfx.white.bold(name)}\t${isOk ? this.cfx.green('ok') : this.cfx.red('ko')}`));
                if (err) {
                    this.logger.log(this.cfx.red(`error: ${err}`));
                }
            };

            this.logger.log(this.cfx.white(`uncompressing ${this.cfx.white.bold(name)}...`));

            try {
                const output = await anzip(`${downloadInfo.filePath}`, {
                    outputPath: tmpDir
                });
                var results: string[] = _.reduce(output.files, (res: string[], val: any): string[] => {
                    var rootDir = path.join(tmpDir, val.directory.split('/').shift());
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

    public copyToInstallationFolder(installation: InstallationAdapterInterface, paths: string[]): Promise<string[]> {
        const name = installation.getName();

        return new Promise<string[]>((resolve, reject) => {
            const rootDir = path.join(this.files.getCwd(), this.config.getRootDirectory());
            var displayStatement = (isOk: boolean, err: string = null): void => {
                this.logger.log(this.cfx.white(`copying ${this.cfx.white.bold(name)}\t${isOk ? this.cfx.green('ok') : this.cfx.red('ko')}`));
                if (err) {
                    this.logger.log(this.cfx.red(`error: ${err}`));
                }
            };

            this.logger.log(this.cfx.white(`copying ${this.cfx.white.bold(name)}...`));

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

}

export function createInstallationAdapterService(logging: LoggingContextInterface, configuration: InstallationConfigurationInterface, fileRepository: FileRepositoryInterface) {
    return new InstallationAdapterService(logging, configuration, fileRepository);
}