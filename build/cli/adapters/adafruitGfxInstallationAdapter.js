"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdafruitGfxInstallationAdapter = void 0;
const tslib_1 = require("tslib");
const _ = require("lodash");
class AdafruitGfxInstallationAdapter {
    constructor(installationService, fileRepository) {
        this.repositoryDlPath = 'https://github.com/adafruit/Adafruit-GFX-Library/archive/master.zip';
        this.getName = () => "adafruit-gfx";
        this.getDependencies = () => [];
        this.apply = (_) => { };
        this.service = installationService;
        this.files = fileRepository;
    }
    execute() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const tmpDir = this.service.prepareTemporaryFolder(this);
            if (tmpDir == null) {
                return -1;
            }
            try {
                var downloadInfo = yield this.service.download(this, this.repositoryDlPath);
                var archives = yield this.service.unzipDownload(this, downloadInfo);
                var replaces = _.map(archives, (val) => {
                    return val.slice(0, val.indexOf('-master'));
                });
                archives.forEach((archive, idx) => {
                    this.files.rename(archive, replaces[idx]);
                });
                yield this.service.copyToInstallationFolder(this, replaces);
                this.service.terminate(this, null);
            }
            catch (e) {
                this.service.terminate(this, e.message || e);
                return -1;
            }
            return 0;
        });
    }
}
exports.AdafruitGfxInstallationAdapter = AdafruitGfxInstallationAdapter;
//# sourceMappingURL=adafruitGfxInstallationAdapter.js.map