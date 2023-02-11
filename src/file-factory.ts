import { join } from 'path';

import { Directory } from './directory';
import { File } from './file';
import { IFileFactory } from './i-file-factory';

export class FileFactory implements IFileFactory {
    public buildDirectory(...paths: string[]) {
        return new Directory(
            this,
            join(...paths)
        );
    }

    public buildFile(...paths: string[]) {
        return new File(
            this,
            join(...paths)
        );
    }
}