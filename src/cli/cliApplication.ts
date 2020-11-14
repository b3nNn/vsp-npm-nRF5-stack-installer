import { AppConfigurationInterface } from './appConfiguration.interface';
import { LoggingContextInterface } from './loggingContext.interface';
import { InstallationProcedureRegistry, createInstallationProcedureRegistry } from '../domain/models';
import * as program from 'commander';

export class CliApplication {
    private configuration: AppConfigurationInterface;
    private logger: any;
    private cfx: any;
    private registry: InstallationProcedureRegistry;

    constructor(configuration: AppConfigurationInterface, logging: LoggingContextInterface) {
        this.configuration = configuration;
        this.logger = logging.getConsole();
        this.cfx = logging.getChalk();
        this.registry = createInstallationProcedureRegistry();
    }

    public execute() {
        program
        .description('Install nRF5 toolchain with extra flavors')
        .option('--nrf52', 'Nordic nRF52 SDK')
        .option('--gxepd2', 'Arduino GxEPD2 library')
        .action(() => {
            this.logger.log(this.cfx.white.bold('Hello world!'));
            this.logger.log(this.configuration.getOptions());
            this.configuration.getOptions().forEach(val => {
                var name = val.slice(2);

                if (this.registry.existsByName(name)) {
                    this.logger.log(this.cfx.white.bold(`Installing ${val.slice(2)}`));
                } else {
                    this.logger.log(this.cfx.red.bold(`Failed to install ${val.slice(2)}`));
                }
            });
        });

        program.parse(this.configuration.getArguments());
    }


}

export function createCliApplication(configuration: AppConfigurationInterface, context: LoggingContextInterface): CliApplication {
    return new CliApplication(configuration, context);
}