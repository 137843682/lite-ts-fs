import { CopyOption } from './copy-option';

export interface IFileEntry {
    readonly name: string;
    readonly path: string;
    /**
     * 复制
     * 
     * 当目标文件存在时，如果 opts.isForce = true 是则覆盖，否则抛出异常
     * 
     * @param opts 
     */
    copyTo(opts: string | string[] | CopyOption): Promise<void>;
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