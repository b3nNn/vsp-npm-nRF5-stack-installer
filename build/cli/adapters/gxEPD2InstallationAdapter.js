"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GxEPD2InstallationAdapter = void 0;
const tslib_1 = require("tslib");
class GxEPD2InstallationAdapter {
    constructor(installationService) {
        this.repositoryDlPath = 'https://github.com/ZinggJM/GxEPD2/archive/master.zip';
        this.getName = () => "gxepd2";
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
exports.GxEPD2InstallationAdapter = GxEPD2InstallationAdapter;
//# sourceMappingURL=gxEPD2InstallationAdapter.js.map