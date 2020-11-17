import * as dlhelper from 'node-downloader-helper';
import { InstallationAdapterInterface } from '../adapters';

export interface InstallationAdapterServiceInterface {
    prepareTemporaryFolder(installation: InstallationAdapterInterface): string;
    terminate(installation: InstallationAdapterInterface, error: string): void;
    download(installation: InstallationAdapterInterface, url: string): Promise<dlhelper.DownloadInfo>;
    unzipDownload(installation: InstallationAdapterInterface, downloadInfo: dlhelper.DownloadInfo): Promise<string[]>;
    copyToInstallationFolder(installation: InstallationAdapterInterface, paths: string[]): Promise<string[]>;
    copyTemporaryFolderAsInstallationFolder(installation: InstallationAdapterInterface, output: string): Promise<string>;
}