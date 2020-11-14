import { LoggingContextInterface } from '../domain/logging/loggingContext.interface';

export class Context implements LoggingContextInterface {
    private console: any;
    private chalk: any;

    public constructor(console: any, chalk: any) {
        this.console = console;
        this.chalk = chalk;
    }

    public getConsole(): any {
        return this.console;
    }

    public getChalk(): any {
        return this.chalk;
    }
}

export function createContext(console: any, chalk: any): Context {
    return new Context(console, chalk);
}