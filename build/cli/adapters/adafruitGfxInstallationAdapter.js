"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdafruitGfxInstallationAdapter = void 0;
const tslib_1 = require("tslib");
class AdafruitGfxInstallationAdapter {
    constructor(installationService) {
        this.repositoryDlPath = 'https://github.com/adafruit/Adafruit-GFX-Library/archive/master.zip';
        this.getName = () => "adafruit-gfx";
        this.getDependencies = () => [];
        this.apply = (_) => { };
        this.service = installationService;
    }
    execute(_) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const tmpDir = this.service.prepareTemporaryFolder(this);
            if (tmpDir == null) {
                return -1;
            }
            try {
                var downloadInfo = yield this.service.download(this, this.repositoryDlPath);
                var archives = yield this.service.unzipDownload(this, downloadInfo);
                yield this.service.copyToInstallationFolder(this, archives);
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