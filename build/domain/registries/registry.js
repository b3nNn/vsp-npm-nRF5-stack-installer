"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Registry = void 0;
const _ = require("lodash");
class Registry {
    constructor() {
        this.registry = [];
    }
    register(registrable) {
        this.registry.push(registrable);
    }
    existsByName(name) {
        return _.filter(this.registry, (registrable) => {
            return registrable.getName() == name;
        }).length > 0;
    }
    get(name) {
        const entries = _.filter(this.registry, (registrable) => {
            if (registrable.getName() == name) {
                return true;
            }
            else {
                return false;
            }
        });
        if (entries.length > 0) {
            return entries[0];
        }
        return null;
    }
    getAllRegistredNames() {
        return _.reduce(this.registry, (res, registrable) => {
            res.push(registrable.getName());
            return res;
        }, []);
    }
}
exports.Registry = Registry;
//# sourceMappingURL=registry.js.map