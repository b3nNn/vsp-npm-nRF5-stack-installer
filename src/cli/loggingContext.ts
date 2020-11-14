export class LoggingContext {
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

export function createLoggingContext(console: any, chalk: any): LoggingContext {
    return new LoggingContext(console, chalk);
}