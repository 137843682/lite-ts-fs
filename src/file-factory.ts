import { join } from 'path';

import { Directory } from './directory';
import { File } from './file';
import { FileFactoryBase } from './file-factory-base';

export class FileFactory extends FileFactoryBase {
    public buildDirectory(...paths: string[]) {
        return new Directory(
            join(...paths),
            this,
        );
    }

    public buildFile(...paths: string[]) {
        return new File(
            join(...paths),
            this,
        );
    }
}