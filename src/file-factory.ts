import { join } from 'path';

import { FsDirectory } from './directory';
import { IFileFactory } from './i-file-factory';
import { FsFile } from './file';

export class FsFileFactory implements IFileFactory {
    public buildDirectory(...paths: string[]) {
        return new FsDirectory(
            this,
            join(...paths)
        );
    }

    public buildFile(...paths: string[]) {
        return new FsFile(
            this,
            join(...paths)
        );
    }
}