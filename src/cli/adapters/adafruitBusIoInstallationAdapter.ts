import * as _ from 'lodash';
import { InstallationAdapterInterface, OptionAdapterInterface } from '../../domain/adapters';
import { InstallationAdapterServiceInterface } from '../../domain/services';
import { FileRepositoryInterface } from '../../domain/repositories';

export class AdafruitBusIoInstallationAdapter implements InstallationAdapterInterface {
    private readonly service: InstallationAdapterServiceInterface;
    private readonly files: FileRepositoryInterface;

    public readonly repositoryDlPath: string = 'https://github.com/adafruit/Adafruit_BusIO/archive/master.zip';

    public constructor(installationService: InstallationAdapterServiceInterface, fileRepository: FileRepositoryInterface) {
        this.service = installationService;
        this.files = fileRepository;
    }

    public getName = () => "adafruit-busio";
    
    public getDependencies = () => [];

    public apply = (_: OptionAdapterInterface): void => {};

    public async execute(): Promise<number> {
        const tmpDir = this.service.prepareTemporaryFolder(this);

        if (tmpDir == null) {
            return -1;
        }

        try {
            var downloadInfo = await this.service.download(this, this.repositoryDlPath);
            var archives = await this.service.unzipDownload(this, downloadInfo);
            var replaces = _.map(archives, (val: string): string => {
                var idx = val.indexOf('-master');
                var len = '-master'.length;
                return val.substr(0, idx) + val.substr(idx + len);
            });
            archives.forEach((archive: string, idx: number) => {
                this.files.copy(archive, replaces[idx]);
            });
            await this.service.copyToInstallationFolder(this, replaces);
            this.service.terminate(this, null);
        } catch(e) {
            this.service.terminate(this, e.message || e);
            return -1;
        }
        return 0;
    }
}