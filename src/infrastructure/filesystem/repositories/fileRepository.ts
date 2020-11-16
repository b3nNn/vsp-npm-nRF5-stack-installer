import * as sh from 'shelljs';
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

    public delete(path: string): number {
        var output = sh.rm('-rf', path);

        if (output.stderr != null) {
            return -1;
        }

        return 0;
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