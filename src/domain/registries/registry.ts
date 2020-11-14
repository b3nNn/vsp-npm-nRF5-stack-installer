import * as _ from 'lodash';
import { RegistryInterface, RegistrableInterface } from '.';

export class Registry<T extends RegistrableInterface> implements RegistryInterface<T> {
    private registry: RegistrableInterface[];
    
    public constructor() {
        this.registry = [];
    }

    public register(registrable: RegistrableInterface) {
        this.registry.push(registrable);
    }

    public existsByName(name: string): boolean {
        return _.filter(this.registry, (registrable: RegistrableInterface) => {
            return registrable.getName() == name;
        }).length > 0;
    }

    public get(name: string): T {
        const entries = _.filter(this.registry, (registrable: RegistrableInterface): boolean => {
            if (registrable.getName() == name) {
                return true;
            } else {
                return false;
            }
        });

        if (entries.length > 0) {
            return entries[0] as T;
        }

        return null;
    }

    public getAllRegistredNames(): string[] {
        return _.reduce(this.registry, (res: string[], registrable: RegistrableInterface): string[] => {
            res.push(registrable.getName());
            return res;
        }, []);
    }
}
