"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cli = require("./cli");
const chalk = require("chalk");
const config = cli.createAppConfiguration(process.argv);
const logginCtx = cli.createLoggingContext(console, chalk);
const ctx = cli.createContext(logginCtx);
const app = cli.createCliApplication(config, ctx);
app.execute();
//# sourceMappingURL=index.js.map