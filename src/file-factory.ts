import { join } from 'path';

import { FsDirectory } from './directory';
import { FsFile } from './file';
import { FileFactoryBase } from './file-factory-base';

export class FsFileFactory extends FileFactoryBase {
    public buildDirectory(...paths: string[]) {
        return new FsDirectory(
            join(...paths),
            this,
        );
    }

    public buildFile(...paths: string[]) {
        return new FsFile(
            join(...paths),
            this,
        );
    }
}