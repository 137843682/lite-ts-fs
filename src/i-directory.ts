import { IFileEntry } from './i-file-entry';
import { IFile } from './i-file';

export interface IDirectory extends IFileEntry {
    /**
     * 创建目录
     * 
     * @param recursive 是否递归创建
     */
    create(recursive?: boolean): Promise<void>;
    /**
     * 查询子目录列表
     */
    findDirectories(): Promise<IDirectory[]>;
    /**
     * 查询子文件列表
     */
    findFiles(): Promise<IFile[]>;
    /**
     * 查询目录内容
     */
    read(): Promise<string[]>;
}