
import * as cli from './cli';
import * as domain from './domain';
import * as filesystem from './infrastructure/filesystem';
import * as chalk from 'chalk';

const config: cli.AppConfiguration = cli.createAppConfiguration(process.argv);
const ctx: cli.Context = cli.createContext(console, chalk);
const fileRepository: filesystem.repositories.FileRepository = filesystem.repositories.createFileRepository();
const installService: domain.services.InstallationService = domain.services.createInstallationService(ctx, config, fileRepository);
const installAdapterService: domain.services.InstallationAdapterService = domain.services.createInstallationAdapterService(ctx, config, fileRepository);
const app: cli.CliApplication = cli.createCliApplication(config, installService, installAdapterService, fileRepository);

app.execute();