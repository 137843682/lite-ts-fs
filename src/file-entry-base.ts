import { existsSync } from 'fs';
import { rename } from 'fs/promises';
import { basename, join } from 'path';

import { CopyOption } from './copy-option';
import { FileFactoryBase } from './file-factory-base';
import { IFileEntry } from './i-file-entry';

export abstract class FileEntryBase implements IFileEntry {
    public name: string;

    public constructor(
        public path: string,
        protected factory: FileFactoryBase,
    ) {
        this.name = basename(path);
    }

    public async copyTo(v: string | string[] | CopyOption) {
        let opt: CopyOption;
        if (typeof v === 'string') {
            opt = {
                paths: [v]
            };
        } else if (Array.isArray(v)) {
            opt = {
                paths: v
            };
        } else {
            opt = v;
        }
        await this.doCopyTo(opt);
    }

    public async exists() {
        return existsSync(this.path);
    }

    public async moveTo(v: any) {
        if (typeof v === 'string')
            v = [v];

        if (!Array.isArray(v))
            throw new Error(`${this.constructor.name}.moveTo: 暂不支持${v?.constructor.name ?? 'null or undefined'}`);

        await rename(
            this.path,
            join(
                ...(v as string[]),
            ),
        );
    }

    public abstract remove(): Promise<void>;
    protected abstract doCopyTo(opts: CopyOption): Promise<void>;
}