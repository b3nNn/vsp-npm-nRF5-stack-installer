"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInstallationAdapterService = exports.InstallationAdapterService = void 0;
const tslib_1 = require("tslib");
const _ = require("lodash");
const path = require("path");
const dlhelper = require("node-downloader-helper");
const anzip = require("anzip");
class InstallationAdapterService {
    constructor(logging, configuration, fileRepository) {
        this.logger = logging.getConsole();
        this.cfx = logging.getChalk();
        this.files = fileRepository;
        this.config = configuration;
    }
    prepareTemporaryFolder(installation) {
        const tmpDir = path.join(this.files.getCwd(), this.config.getTemporaryDirectory(), installation.getName());
        var displayStatement = (isOk, err = null) => {
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
    terminate(installation, error = null) {
        if (error == null) {
            this.logger.log(this.cfx.green(`${this.cfx.green.bold(installation.getName())} installation succeded`));
        }
        else {
            this.logger.log(this.cfx.red(`${this.cfx.red.bold(installation.getName())} installation failed`));
            this.logger.log(this.cfx.red(`error: ${error}`));
        }
    }
    download(installation, url) {
        const name = installation.getName();
        return new Promise((resolve, reject) => {
            const tmpDir = path.join(this.files.getCwd(), this.config.getTemporaryDirectory(), installation.getName());
            const dl = new dlhelper.DownloaderHelper(url, tmpDir);
            var displayStatement = (isOk, err = null) => {
                this.logger.log(this.cfx.white(`downloading ${this.cfx.white.bold(name)}\t${isOk ? this.cfx.green('ok') : this.cfx.red('ko')}`));
                if (err) {
                    this.logger.log(this.cfx.red(`error: ${err}`));
                }
            };
            dl.on('download', () => {
                this.logger.log(this.cfx.white(`downloading ${this.cfx.white.bold(name)}...`));
            });
            dl.on('end', (downloadInfo) => {
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
    unzipDownload(installation, downloadInfo) {
        const name = installation.getName();
        return new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const tmpDir = path.join(this.files.getCwd(), this.config.getTemporaryDirectory(), installation.getName());
            var displayStatement = (isOk, err = null) => {
                this.logger.log(this.cfx.white(`uncompressing ${this.cfx.white.bold(name)}\t${isOk ? this.cfx.green('ok') : this.cfx.red('ko')}`));
                if (err) {
                    this.logger.log(this.cfx.red(`error: ${err}`));
                }
            };
            this.logger.log(this.cfx.white(`uncompressing ${this.cfx.white.bold(name)}...`));
            try {
                const output = yield anzip(`${downloadInfo.filePath}`, {
                    outputPath: tmpDir
                });
                var results = _.reduce(output.files, (res, val) => {
                    var rootDir = path.join(tmpDir, val.directory.split(path.sep).shift());
                    if (!_.includes(res, rootDir)) {
                        res.push(rootDir);
                    }
                    return res;
                }, []);
                displayStatement(true);
                resolve(results);
            }
            catch (e) {
                displayStatement(false, `not able to unzip the archive '${downloadInfo.filePath}'`);
                reject(e);
            }
        }));
    }
    copyToInstallationFolder(installation, paths) {
        const name = installation.getName();
        return new Promise((resolve, reject) => {
            const rootDir = path.join(this.files.getCwd(), this.config.getRootDirectory());
            var displayStatement = (isOk, err = null) => {
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
exports.InstallationAdapterService = InstallationAdapterService;
function createInstallationAdapterService(logging, configuration, fileRepository) {
    return new InstallationAdapterService(logging, configuration, fileRepository);
}
exports.createInstallationAdapterService = createInstallationAdapterService;
//# sourceMappingURL=installationAdapterService.js.map