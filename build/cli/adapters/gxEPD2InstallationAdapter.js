"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GxEPD2InstallationAdapter = void 0;
const tslib_1 = require("tslib");
const _ = require("lodash");
class GxEPD2InstallationAdapter {
    constructor(installationService, fileRepository) {
        this.repositoryDlPath = 'https://github.com/ZinggJM/GxEPD2/archive/master.zip';
        this.getName = () => "gxepd2";
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
                    var idx = val.indexOf('-master');
                    var len = '-master'.length;
                    return val.substr(0, idx) + val.substr(idx + len);
                });
                archives.forEach((archive, idx) => {
                    this.files.copy(archive, replaces[idx]);
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
exports.GxEPD2InstallationAdapter = GxEPD2InstallationAdapter;
//# sourceMappingURL=gxEPD2InstallationAdapter.js.map