export interface FileRepositoryInterface {
    getCwd(): string;
    createDirectory(path: string): number;
    copy(source: string, destination: string): number;
    delete(path: string): number;
    isDirectory(path: string): boolean;
    exists(path: string): boolean;
    rename(source: string, destination: string): number;
}