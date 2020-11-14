"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAppConfiguration = exports.AppConfiguration = void 0;
const _ = require("lodash");
class AppConfiguration {
    constructor(argv) {
        this.argv = argv;
    }
    getArguments() {
        return this.argv;
    }
    getOptions() {
        return _.reduce(this.argv, (res, val) => {
            if (val.indexOf('--') == 0 && !_.includes(res, val)) {
                res.push(val);
            }
            return res;
        }, []);
    }
}
exports.AppConfiguration = AppConfiguration;
function createAppConfiguration(argv) {
    return new AppConfiguration(argv);
}
exports.createAppConfiguration = createAppConfiguration;
//# sourceMappingURL=appConfiguration.js.map