import * as path from 'path';
import { AppConfigurationInterface, InstallationConfigurationInterface } from '../domain/configurations';

export class AppConfiguration implements AppConfigurationInterface, InstallationConfigurationInterface {
    private argv: string[];

    public constructor(argv: string[]) {
        this.argv = argv;
    }

    public getArguments(): string[] {
        return this.argv;
    }

    public getRootDirectory = () => 'vendor';

    public getTemporaryDirectory = () => path.join(this.getRootDirectory(), '.tmp');
}

export function createAppConfiguration(argv: string[]): AppConfiguration {
    return new AppConfiguration(argv);
}