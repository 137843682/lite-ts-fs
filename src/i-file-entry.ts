import { IFileFactory } from './i-file-factory';

export interface IFileEntry {
    readonly factory: IFileFactory,
    readonly name: string;
    readonly path: string;
    exists(): Promise<boolean>;
    moveTo(v: any): Promise<void>;
    remove(): Promise<void>;
}