"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAppConfiguration = exports.AppConfiguration = void 0;
class AppConfiguration {
    constructor(argv) {
        this.argv = argv;
    }
    getArguments() {
        return this.argv;
    }
}
exports.AppConfiguration = AppConfiguration;
function createAppConfiguration(argv) {
    return new AppConfiguration(argv);
}
exports.createAppConfiguration = createAppConfiguration;
//# sourceMappingURL=appConfiguration.js.map