import { IFileEntry } from './i-file-entry';
import { IFile } from './i-file';

export interface IDirectory extends IFileEntry {
    create(recursive?: boolean): Promise<void>;
    findDirectories(): Promise<IDirectory[]>;
    findFiles(): Promise<IFile[]>;
    read(): Promise<string[]>;
}