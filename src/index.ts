
import * as cli from './cli';
import * as domain from './domain';
import * as chalk from 'chalk';

const config: cli.AppConfiguration = cli.createAppConfiguration(process.argv);
const ctx: cli.Context = cli.createContext(console, chalk);
const installService: domain.services.InstallationService = domain.services.createInstallationService(ctx);
const app: cli.CliApplication = cli.createCliApplication(config, installService);

app.execute();