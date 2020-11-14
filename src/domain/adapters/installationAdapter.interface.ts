import { OptionAdapterInterface } from '.';

export interface InstallationAdapterInterface {
    getName(): string;
    getDependencies(): string[];
    acceptOption(option: OptionAdapterInterface): boolean;
    apply(option: OptionAdapterInterface): void;
}