
import * as cli from './cli';
import * as chalk from 'chalk';

const config: cli.AppConfiguration = cli.createAppConfiguration(process.argv);
const logginCtx: cli.LoggingContext = cli.createLoggingContext(console, chalk);
const ctx: cli.Context = cli.createContext(logginCtx);
const app: cli.CliApplication = cli.createCliApplication(config, ctx);

app.execute();