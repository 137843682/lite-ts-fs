import { IFileEntry } from './i-file-entry';

export interface IFile extends IFileEntry {
    readonly ext: string;
    /**
     * 读取JSON数据
     */
    read<T>(): Promise<T>;
    /**
     * 读取字符串
     */
    readString(): Promise<string>;
    /**
     * 读取YAML
     */
    readYaml<T>(): Promise<T>;
    /**
     * 写入文件
     */
    write(v: any): Promise<void>;
}