"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cli = require("./cli");
const domain = require("./domain");
const filesystem = require("./infrastructure/filesystem");
const chalk = require("chalk");
const config = cli.createAppConfiguration(process.argv);
const ctx = cli.createContext(console, chalk);
const fileRepository = filesystem.repositories.createFileRepository();
const installService = domain.services.createInstallationService(ctx, config, fileRepository);
const app = cli.createCliApplication(config, installService);
app.execute();
//# sourceMappingURL=index.js.map