import * as _ from 'lodash';
import { AppConfigurationInterface } from './appConfiguration.interface';

export class AppConfiguration implements AppConfigurationInterface {
    private argv: string[];

    public constructor(argv: string[]) {
        this.argv = argv;
    }

    public getArguments(): string[] {
        return this.argv;
    }

    public getOptions(): string[] {
        return _.reduce(this.argv, (res, val) => {
            if (val.indexOf('--') == 0 && !_.includes(res, val)) {
                res.push(val);
            }
            return res;
        }, [])
    }
}

export function createAppConfiguration(argv: string[]): AppConfiguration {
    return new AppConfiguration(argv);
}