"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContext = exports.Context = void 0;
class Context {
    constructor(logging) {
        this.logging = logging;
    }
    getLogging() {
        return this.logging;
    }
    getConsole() {
        return this.logging.getConsole();
    }
    getChalk() {
        return this.logging.getChalk();
    }
}
exports.Context = Context;
function createContext(logging) {
    return new Context(logging);
}
exports.createContext = createContext;
//# sourceMappingURL=context.js.map