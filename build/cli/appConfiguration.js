"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAppConfiguration = exports.AppConfiguration = void 0;
const path = require("path");
class AppConfiguration {
    constructor(argv) {
        this.getRootDirectory = () => 'vendor';
        this.getTemporaryDirectory = () => path.join(this.getRootDirectory(), '.tmp');
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