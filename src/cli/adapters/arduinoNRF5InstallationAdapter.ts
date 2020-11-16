import { InstallationAdapterInterface, OptionAdapterInterface } from '../../domain/adapters';
import { InstallationConfigurationInterface } from '../../domain/configurations';
import { InstallationAdapterServiceInterface } from '../../domain/services';

export class ArduinoNRF5InstallationAdapter implements InstallationAdapterInterface {
    private readonly service: InstallationAdapterServiceInterface;

    public readonly repositoryDlPath: string = 'https://github.com/sandeepmistry/arduino-nRF5/archive/master.zip';

    public constructor(installationService: InstallationAdapterServiceInterface) {
        this.service = installationService;
    }

    public getName = () => "arduino-nrf5";
    
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