export interface FileRepositoryInterface {
    getCwd(): string;
    createDirectory(path: string): number;
    copy(source: string, destination: string): number;
    delete(path: string): Promise<number>;
    isDirectory(path: string): boolean;
    exists(path: string): boolean;
}