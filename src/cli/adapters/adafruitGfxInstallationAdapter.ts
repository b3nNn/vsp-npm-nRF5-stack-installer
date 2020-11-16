import { InstallationAdapterInterface, OptionAdapterInterface } from '../../domain/adapters';
import { InstallationConfigurationInterface } from '../../domain/configurations';
import { InstallationAdapterServiceInterface } from '../../domain/services';

export class AdafruitGfxInstallationAdapter implements InstallationAdapterInterface {
    private readonly service: InstallationAdapterServiceInterface;

    public readonly repositoryDlPath: string = 'https://github.com/adafruit/Adafruit-GFX-Library/archive/master.zip';

    public constructor(installationService: InstallationAdapterServiceInterface) {
        this.service = installationService;
    }

    public getName = () => "adafruit-gfx";
    
    public getDependencies = () => [];

    public apply = (_: OptionAdapterInterface): void => {};

    public async execute(_: InstallationConfigurationInterface): Promise<number> {
        const tmpDir = this.service.prepareTemporaryFolder(this);

        if (tmpDir == null) {
            return -1;
        }

        try {
            var downloadInfo = await this.service.download(this, this.repositoryDlPath);
            var archives = await this.service.unzipDownload(this, downloadInfo);
            await this.service.copyToInstallationFolder(this, archives);
            this.service.terminate(this, null);
        } catch(e) {
            this.service.terminate(this, e.message || e);
            return -1;
        }
        return 0;
    }
}