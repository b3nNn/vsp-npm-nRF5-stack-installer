import { OptionAdapterInterface } from '.';

export interface InstallationAdapterInterface {
    getName(): string;
    getDependencies(): string[];
    apply(option: OptionAdapterInterface): void;
    execute(): Promise<number>;
}