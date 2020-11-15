"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFileRepository = exports.FileRepository = void 0;
const sh = require("shelljs");
class FileRepository {
    getCwd() {
        return process.cwd();
    }
    createDirectory(path) {
        var output = sh.mkdir('-p', path);
        if (output.stderr != null) {
            return -1;
        }
        return 0;
    }
    copy(source, destination) {
        var output = sh.cp('-rf', source, destination);
        if (output.stderr != null) {
            return -1;
        }
        return 0;
    }
    isDirectory(path) {
        return sh.test('-d', path);
    }
    exists(path) {
        return sh.test('-e', path);
    }
}
exports.FileRepository = FileRepository;
function createFileRepository() {
    return new FileRepository();
}
exports.createFileRepository = createFileRepository;
//# sourceMappingURL=fileRepository.js.map