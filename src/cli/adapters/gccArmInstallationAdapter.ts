import * as _ from 'lodash';
import { InstallationAdapterInterface, OptionAdapterInterface } from '../../domain/adapters';
import { InstallationAdapterServiceInterface } from '../../domain/services';

export class GccArmInstallationAdapter implements InstallationAdapterInterface {
    private readonly service: InstallationAdapterServiceInterface;

    private readonly winPath: string = 'https://armkeil.blob.core.windows.net/developer/Files/downloads/gnu-rm/9-2020q2/gcc-arm-none-eabi-9-2020-q2-update-win32.zip';
    private readonly linuxPath: string = 'https://armkeil.blob.core.windows.net/developer/Files/downloads/gnu-rm/9-2020q2/gcc-arm-none-eabi-9-2020-q2-update-x86_64-linux.tar.bz2';
    private readonly osxPath: string = 'https://armkeil.blob.core.windows.net/developer/Files/downloads/gnu-rm/9-2020q2/gcc-arm-none-eabi-9-2020-q2-update-mac.tar.bz2';
    private readonly isWin: boolean = process.platform === "win32";
    private readonly isLinux: boolean = process.platform === "linux";
    private readonly isOsx: boolean = process.platform === "darwin";

    public constructor(installationService: InstallationAdapterServiceInterface) {
        this.service = installationService;
    }

    public getName = () => "gcc-arm";
    
    public getDependencies = () => [];

    public apply = (_: OptionAdapterInterface): void => {};

    public async execute(): Promise<number> {
        const tmpDir = this.service.prepareTemporaryFolder(this);

        if (tmpDir == null) {
            return -1;
        }

        try {
            var downloadInfo
            
            if (this.isWin) {
                downloadInfo = await this.service.download(this, this.winPath);
                await this.service.unzipDownload(this, downloadInfo);
                await this.service.copyTemporaryFolderAsInstallationFolder(this, 'arm-none-eabi');
                } else if (this.isLinux) {
                downloadInfo = await this.service.download(this, this.linuxPath);
            } else if (this.isOsx) {
                downloadInfo = await this.service.download(this, this.osxPath);
            } else {
                this.service.terminate(this, `unsupported platform ${process.platform}`);
                return -1;
            }
            this.service.terminate(this, null);
        } catch(e) {
            this.service.terminate(this, e.message || e);
            return -1;
        }
        return 0;
    }
}