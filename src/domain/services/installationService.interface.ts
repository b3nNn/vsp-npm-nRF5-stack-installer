import { InstallationAdapterInterface, OptionAdapterInterface } from '../adapters';
import { Registry } from '../registries/registry';

export interface InstallationServiceInterface {
    install(requirements: string[], installations: Registry<InstallationAdapterInterface>, options: Registry<OptionAdapterInterface>);
}