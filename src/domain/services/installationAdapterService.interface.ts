import * as dlhelper from 'node-downloader-helper';
import { InstallationAdapterInterface } from '../adapters';

export interface InstallationAdapterServiceInterface {
    prepareTemporaryFolder(installation: InstallationAdapterInterface): string;
    terminate(installation: InstallationAdapterInterface, error: string): void;
    download(installation: InstallationAdapterInterface, name: string, url: string): Promise<dlhelper.DownloadInfo>;
    unzipDownload(installation: InstallationAdapterInterface, name: string, downloadInfo: dlhelper.DownloadInfo): Promise<string[]>;
    copyToInstallationFolder(name: string, paths: string[]): Promise<string[]>;
}