import * as sh from 'shelljs';
import * as fs from 'fs';
import * as del from 'del';
import * as path from 'path';
import { FileRepositoryInterface } from '../../../domain/repositories/fileRepository.interface';

export class FileRepository implements FileRepositoryInterface {
    public getCwd(): string {
        return process.cwd();
    }

    public createDirectory(path: string): number {
        var output = sh.mkdir('-p', path);

        if (output.stderr != null) {
            return -1;
        }

        return 0;
    }

    public copy(source: string, destination: string): number {
        var output = sh.cp('-rf', source, destination);

        if (output.stderr != null) {
            return -1;
        }

        return 0;
    }

    public async delete(deletePath: string): Promise<number> {
        return new Promise(async resolve => {
            if (fs.existsSync(deletePath)) {
                try {
                    var list = fs.readdirSync(deletePath);
                    for (var it = 0; it < list.length; it++) {
                        var file = list[it];
                        var curPath = path.join(deletePath, file);
                        if(fs.lstatSync(curPath).isDirectory()) { // recurse
                              await this.delete(curPath);
                          } else if (curPath.endsWith('.zip')) {
                            await del(curPath);
                        } else {
                            fs.unlinkSync(curPath);
                          }
                      }
                      if (fs.lstatSync(deletePath).isDirectory()) {
                        await del(deletePath);
                      } else {
                        fs.unlinkSync(deletePath);
                      }
                    resolve(0);
                } catch (e) {
                    resolve(-1);
                }
            } else {
                resolve(0);
            }
        });
    }

    public isDirectory(path: string): boolean {
        return sh.test('-d', path);
    }

    public exists(path: string): boolean {
        return sh.test('-e', path);
    }
}

export function createFileRepository(): FileRepository {
    return new FileRepository();
}