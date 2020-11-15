"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInstallationService = exports.InstallationService = void 0;
const tslib_1 = require("tslib");
const _ = require("lodash");
const path = require("path");
const dlhelper = require("node-downloader-helper");
const anzip = require("anzip");
class InstallationService {
    constructor(logging, configuration, fileRepository) {
        this.logger = logging.getConsole();
        this.cfx = logging.getChalk();
        this.files = fileRepository;
        this.config = configuration;
    }
    installRequirements(requirements, installations, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.logger.log(this.cfx.white(`running from ${this.cfx.white.bold(this.files.getCwd())}`));
            if (this.validateRequirements(requirements, installations, options) != 0) {
                return -1;
            }
            if (this.prepare() != 0) {
                return -1;
            }
            if ((yield this.installAll(this.getInstallations(requirements, installations), this.getOptions(requirements, options))) != 0) {
                return -1;
            }
            return 0;
        });
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
    prepare() {
        const tmpDir = path.join(this.files.getCwd(), this.config.getTemporaryDirectory());
        var displayStatement = (isOk, err = null) => {
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
    download(installation, name, url) {
        return new Promise((resolve, reject) => {
            const tmpDir = path.join(this.files.getCwd(), this.config.getTemporaryDirectory(), installation.getName());
            const dl = new dlhelper.DownloaderHelper(url, tmpDir);
            var displayStatement = (isOk, err = null) => {
                this.logger.log(this.cfx.white(`downloading ${name}\t${isOk ? this.cfx.green('ok') : this.cfx.red('ko')}`));
                if (err) {
                    this.logger.log(this.cfx.red(`error: ${err}`));
                }
            };
            dl.on('download', () => {
                this.logger.log(this.cfx.white(`downloading ${name}...`));
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
    unzipDownload(installation, name, downloadInfo) {
        return new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const tmpDir = path.join(this.files.getCwd(), this.config.getTemporaryDirectory(), installation.getName());
            var displayStatement = (isOk, err = null) => {
                this.logger.log(this.cfx.white(`uncompressing ${name}\t${isOk ? this.cfx.green('ok') : this.cfx.red('ko')}`));
                if (err) {
                    this.logger.log(this.cfx.red(`error: ${err}`));
                }
            };
            this.logger.log(this.cfx.white(`uncompressing ${name}...`));
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
    copyToInstallationFolder(name, paths) {
        return new Promise((resolve, reject) => {
            const rootDir = path.join(this.files.getCwd(), this.config.getRootDirectory());
            var displayStatement = (isOk, err = null) => {
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
    validateRequirements(requirements, installations, options) {
        var exists = [...installations.getAllRegistredNames(), ...options.getAllRegistredNames()];
        var missings = _.difference(requirements, exists);
        var displayStatement = (isOk, err = null) => {
            this.logger.log(this.cfx.white(`validating requirements\t${isOk ? this.cfx.green('ok') : this.cfx.red('ko')}`));
            if (err) {
                this.logger.log(this.cfx.red(`error: ${err}`));
            }
        };
        if (requirements == null || requirements.length == 0) {
            displayStatement(false, 'nothing to install');
            return -1;
        }
        else if (missings.length > 0) {
            missings.forEach(name => {
                displayStatement(false, `${name} is not a valid ${this.cfx.red.bold('installation')} nor ${this.cfx.red.bold('option')}`);
            });
            return -1;
        }
        else {
            displayStatement(true);
        }
        return 0;
    }
    installAll(installations, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            for (var it = 0; it < installations.length; it++) {
                if ((yield this.installSingle(installations[it], options)) != 0) {
                    return -1;
                }
            }
            return 0;
        });
    }
    installSingle(installation, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            _.forEach(options, (opt) => {
                installation.apply(opt);
            });
            return yield installation.execute(this.config);
        });
    }
    getInstallations(requirements, installations) {
        return _.reduce(requirements, (res, name) => {
            if (name.indexOf('--') == -1) {
                res.push(installations.get(name));
            }
            return res;
        }, []);
    }
    getOptions(requirements, options) {
        return _.reduce(requirements, (res, name) => {
            if (name.indexOf('--') == 0) {
                res.push(options.get(name));
            }
            return res;
        }, []);
    }
}
exports.InstallationService = InstallationService;
function createInstallationService(logging, configuration, fileRepository) {
    return new InstallationService(logging, configuration, fileRepository);
}
exports.createInstallationService = createInstallationService;
//# sourceMappingURL=installationService.js.map