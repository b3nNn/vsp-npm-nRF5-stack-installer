"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLoggingContext = exports.LoggingContext = void 0;
class LoggingContext {
    constructor(console, chalk) {
        this.console = console;
        this.chalk = chalk;
    }
    getConsole() {
        return this.console;
    }
    getChalk() {
        return this.chalk;
    }
}
exports.LoggingContext = LoggingContext;
function createLoggingContext(console, chalk) {
    return new LoggingContext(console, chalk);
}
exports.createLoggingContext = createLoggingContext;
//# sourceMappingURL=loggingContext.js.map