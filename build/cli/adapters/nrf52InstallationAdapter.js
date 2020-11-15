"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nRF52InstallationAdapter = void 0;
const tslib_1 = require("tslib");
class nRF52InstallationAdapter {
    constructor(installationService) {
        this.nordicSDKPath = 'https://www.nordicsemi.com/-/media/Software-and-other-downloads/SDKs/nRF5/Binaries/nRF5SDK1702d674dde.zip';
        this.getName = () => "nrf52";
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
                var downloadInfo = yield this.service.download(this, 'nRF52 SDK v17.0.2', this.nordicSDKPath);
                var archives = yield this.service.unzipDownload(this, 'nRF52 SDK v17.0.2', downloadInfo);
                yield this.service.copyToInstallationFolder('nRF52 SDK v17.0.2', archives);
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
exports.nRF52InstallationAdapter = nRF52InstallationAdapter;
//# sourceMappingURL=nrf52InstallationAdapter.js.map