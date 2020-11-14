import * as program from 'commander';
import { AppConfigurationInterface } from '.';
import { InstallationService } from '../domain/services';
import { InstallationAdapterInterface, OptionAdapterInterface } from '../domain/adapters';
import { Registry } from '../domain/registries/registry';
import { nRF52InstallationAdapter, UpgradeOptionAdapter, ReinstallOptionAdapter } from './adapters';
import * as _ from 'lodash';

export class CliApplication {
    private configuration: AppConfigurationInterface;
    private installations: Registry<InstallationAdapterInterface>;
    private options: Registry<OptionAdapterInterface>;
    private installService: InstallationService;

    constructor(configuration: AppConfigurationInterface, installService: InstallationService) {
        this.configuration = configuration;
        this.installations = new Registry<InstallationAdapterInterface>();
        this.options = new Registry<OptionAdapterInterface>();
        this.installService = installService;
    }

    public execute() {
        program
        .description('Install nRF5 toolchain with extra flavors')
        .option('--nrf52', 'Nordic nRF52 SDK')
        .option('--gxepd2', 'Arduino GxEPD2 library')
        .option('--upgrade', 'Upgrade provided installations')
        .option('--reinstall', 'Reinstall provided installations')
        .action(() => {
            var requirements = _.reduce(this.configuration.getOptions(), (res: string[], val: string): string[] => {
                var name = val.slice(2);

                res.push(name);
                return res;
            }, []);

            this.setupRegistries();
            this.installService.install(requirements, this.installations, this.options);
        });

        program.parse(this.configuration.getArguments());
    }

    private setupRegistries() {
        this.installations.register(new nRF52InstallationAdapter());
        this.options.register(new ReinstallOptionAdapter());
        this.options.register(new UpgradeOptionAdapter());
    }
}

export function createCliApplication(configuration: AppConfigurationInterface, installService: InstallationService): CliApplication {
    return new CliApplication(configuration, installService);
}