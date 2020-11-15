import * as program from 'commander';
import { AppConfigurationInterface } from '.';
import { InstallationService } from '../domain/services';
import { InstallationAdapterInterface, OptionAdapterInterface } from '../domain/adapters';
import { Registry } from '../domain/registries';
import { nRF52InstallationAdapter, UpgradeOptionAdapter, ReinstallOptionAdapter } from './adapters';

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
        .command('install [installation...]', { isDefault: true })
        .description('Install nRF5 toolchain with extra flavors')
        .option('--upgrade', 'Upgrade provided installations')
        .option('--reinstall', 'Reinstall provided installations')
        .action((_, opts) => {
            this.setupRegistries();
            this.installService.installRequirements(opts.parent?.args, this.installations, this.options);
        });

        program.parse(this.configuration.getArguments());
    }

    private setupRegistries() {
        this.installations.register(new nRF52InstallationAdapter(this.installService));
        this.options.register(new ReinstallOptionAdapter());
        this.options.register(new UpgradeOptionAdapter());
    }
}

export function createCliApplication(configuration: AppConfigurationInterface, installService: InstallationService): CliApplication {
    return new CliApplication(configuration, installService);
}