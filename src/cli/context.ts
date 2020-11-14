import { LoggingContext } from './loggingContext';
import { LoggingContextInterface } from './loggingContext.interface';

export class Context implements LoggingContextInterface {
    private logging: LoggingContext;

    public constructor(logging: LoggingContext) {
        this.logging = logging;
    }

    public getLogging(): LoggingContext {
        return this.logging;
    }

    public getConsole(): any {
        return this.logging.getConsole();
    }

    public getChalk(): any {
        return this.logging.getChalk();
    }
}

export function createContext(logging: LoggingContext): Context {
    return new Context(logging);
}