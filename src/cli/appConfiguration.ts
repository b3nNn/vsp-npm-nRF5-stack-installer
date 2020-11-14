import { AppConfigurationInterface } from '../domain/configurations';

export class AppConfiguration implements AppConfigurationInterface {
    private argv: string[];

    public constructor(argv: string[]) {
        this.argv = argv;
    }

    public getArguments(): string[] {
        return this.argv;
    }
}

export function createAppConfiguration(argv: string[]): AppConfiguration {
    return new AppConfiguration(argv);
}