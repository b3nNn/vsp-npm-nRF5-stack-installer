import * as program from 'commander';
import { AppConfigurationInterface } from '.';
import { InstallationService, InstallationAdapterService } from '../domain/services';
import { InstallationAdapterInterface, OptionAdapterInterface } from '../domain/adapters';
import { Registry } from '../domain/registries';
import { AdafruitGfxInstallationAdapter, ArduinoNRF5InstallationAdapter, GxEPD2InstallationAdapter, NRF52InstallationAdapter, UpgradeOptionAdapter, ReinstallOptionAdapter } from './adapters';

export class CliApplication {
    private readonly configuration: AppConfigurationInterface;
    private readonly installations: Registry<InstallationAdapterInterface>;
    private readonly options: Registry<OptionAdapterInterface>;
    private readonly installService: InstallationService;
    private readonly installAdapterService: InstallationAdapterService;

    constructor(configuration: AppConfigurationInterface, installService: InstallationService, installAdapterService: InstallationAdapterService) {
        this.configuration = configuration;
        this.installations = new Registry<InstallationAdapterInterface>();
        this.options = new Registry<OptionAdapterInterface>();
        this.installService = installService;
        this.installAdapterService = installAdapterService;
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
        this.installations.register(new AdafruitGfxInstallationAdapter(this.installAdapterService));
        this.installations.register(new ArduinoNRF5InstallationAdapter(this.installAdapterService));
        this.installations.register(new GxEPD2InstallationAdapter(this.installAdapterService));
        this.installations.register(new NRF52InstallationAdapter(this.installAdapterService));
        this.options.register(new ReinstallOptionAdapter());
        this.options.register(new UpgradeOptionAdapter());
    }
}

export function createCliApplication(configuration: AppConfigurationInterface, installService: InstallationService, installAdapterService: InstallationAdapterService): CliApplication {
    return new CliApplication(configuration, installService, installAdapterService);
}