import { ICopyOption } from './i-copy-option';
import { IFileFactory } from './i-file-factory';

export interface IFileEntry {
    readonly factory: IFileFactory,
    readonly name: string;
    readonly path: string;
    /**
     * 复制
     * 
     * 当目标文件存在时，如果 opts.isForce = true 是则覆盖，否则抛出异常
     * 
     * @param opts 
     */
    copyTo(opts: string | string[] | ICopyOption): Promise<void>;
    /**
     * 是否存在
     */
    exists(): Promise<boolean>;
    /**
     * 移动
     * 
     * @param v 
     */
    moveTo(v: any): Promise<void>;
    /**
     * 删除
     */
    remove(): Promise<void>;
}