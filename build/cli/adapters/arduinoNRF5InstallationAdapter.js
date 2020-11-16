"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArduinoNRF5InstallationAdapter = void 0;
const tslib_1 = require("tslib");
class ArduinoNRF5InstallationAdapter {
    constructor(installationService) {
        this.repositoryDlPath = 'https://github.com/sandeepmistry/arduino-nRF5/archive/master.zip';
        this.getName = () => "arduino-nrf5";
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
exports.ArduinoNRF5InstallationAdapter = ArduinoNRF5InstallationAdapter;
//# sourceMappingURL=arduinoNRF5InstallationAdapter.js.map