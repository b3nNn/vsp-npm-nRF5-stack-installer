import { OptionAdapterInterface } from '.';
import { InstallationConfigurationInterface } from '../configurations';

export interface InstallationAdapterInterface {
    getName(): string;
    getDependencies(): string[];
    apply(option: OptionAdapterInterface): void;
    execute(configuration: InstallationConfigurationInterface): Promise<number>;
}