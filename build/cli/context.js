"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContext = exports.Context = void 0;
class Context {
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
exports.Context = Context;
function createContext(console, chalk) {
    return new Context(console, chalk);
}
exports.createContext = createContext;
//# sourceMappingURL=context.js.map