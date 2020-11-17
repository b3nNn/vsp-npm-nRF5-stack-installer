"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFileRepository = exports.FileRepository = void 0;
const tslib_1 = require("tslib");
const sh = require("shelljs");
const fs = require("fs");
const del = require("del");
const path = require("path");
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
    delete(deletePath) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                if (fs.existsSync(deletePath)) {
                    try {
                        var list = fs.readdirSync(deletePath);
                        for (var it = 0; it < list.length; it++) {
                            var file = list[it];
                            var curPath = path.join(deletePath, file);
                            if (fs.lstatSync(curPath).isDirectory()) {
                                yield this.delete(curPath);
                            }
                            else if (curPath.endsWith('.zip')) {
                                yield del(curPath);
                            }
                            else {
                                fs.unlinkSync(curPath);
                            }
                        }
                        if (fs.lstatSync(deletePath).isDirectory()) {
                            yield del(deletePath);
                        }
                        else {
                            fs.unlinkSync(deletePath);
                        }
                        resolve(0);
                    }
                    catch (e) {
                        resolve(-1);
                    }
                }
                else {
                    resolve(0);
                }
            }));
        });
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