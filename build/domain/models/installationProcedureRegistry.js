"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInstallationProcedureRegistry = exports.InstallationProcedureRegistry = void 0;
const _ = require("lodash");
class InstallationProcedureRegistry {
    constructor() {
        this.registry = [];
    }
    register(procedure) {
        this.registry.push(procedure);
    }
    existsByName(name) {
        return _.map(this.registry, (procedure) => {
            return procedure.name == name;
        }).length > 0;
    }
}
exports.InstallationProcedureRegistry = InstallationProcedureRegistry;
function createInstallationProcedureRegistry() {
    return new InstallationProcedureRegistry();
}
exports.createInstallationProcedureRegistry = createInstallationProcedureRegistry;
//# sourceMappingURL=installationProcedureRegistry.js.map