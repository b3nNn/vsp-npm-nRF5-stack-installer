import { InstallationProcedure } from '.';
import * as _ from 'lodash';

export class InstallationProcedureRegistry {
    private registry: InstallationProcedure[];
    
    public constructor() {
        this.registry = [];
    }

    public register(procedure: InstallationProcedure) {
        this.registry.push(procedure);
    }

    public existsByName(name: string) {
        return _.map(this.registry, (procedure: InstallationProcedure) => {
            return procedure.name == name;
        }).length > 0;
    }
}

export function createInstallationProcedureRegistry(): InstallationProcedureRegistry {
    return new InstallationProcedureRegistry();
}