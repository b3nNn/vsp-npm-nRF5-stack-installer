import * as _ from 'lodash';
import { RegistrableInterface } from '.';

export interface RegistryInterface<T> {
    register(adapter: RegistrableInterface);
    existsByName(name: string);
    get(name: string): T;
    getAllRegistredNames(): string[];
}
