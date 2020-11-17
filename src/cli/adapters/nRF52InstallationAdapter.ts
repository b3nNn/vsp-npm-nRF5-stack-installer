import * as _ from 'lodash';
import { InstallationAdapterInterface, OptionAdapterInterface } from '../../domain/adapters';
import { InstallationAdapterServiceInterface } from '../../domain/services';

export class NRF52InstallationAdapter implements InstallationAdapterInterface {
    private readonly service: InstallationAdapterServiceInterface;

    public readonly nordicSDKPath: string = 'https://www.nordicsemi.com/-/media/Software-and-other-downloads/SDKs/nRF5/Binaries/nRF5SDK1702d674dde.zip';

    public constructor(installationService: InstallationAdapterServiceInterface) {
        this.service = installationService;
    }

    public getName = () => "nrf52";
    
    public getDependencies = () => [];

    public apply = (_: OptionAdapterInterface): void => {};

    public async execute(): Promise<number> {
        const tmpDir = this.service.prepareTemporaryFolder(this);

        if (tmpDir == null) {
            return -1;
        }

        try {
            var downloadInfo = await this.service.download(this, this.nordicSDKPath);
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