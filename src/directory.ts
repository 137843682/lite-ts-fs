import { Stats } from 'fs';
import { mkdir, readdir, rm, stat } from 'fs/promises';
import { join } from 'path';

import { CopyOption } from './copy-option';
import { FsFile, } from './file';
import { FileEntryBase } from './file-entry-base';
import { IDirectory } from './i-directory';
import { IFile } from './i-file';
import { IFileEntry } from './i-file-entry';

export class FsDirectory extends FileEntryBase implements IDirectory {
    public async create(recursive?: boolean) {
        const isExist = await this.exists();
        if (isExist)
            return;

        await mkdir(this.path, {
            recursive: recursive
        });
    }

    public async findDirectories() {
        return await this.scan<IDirectory>((fileStat, filePath) => {
            return fileStat.isDirectory() ? new FsDirectory(filePath, this.factory) : null;
        });
    }

    public async findFiles() {
        return await this.scan<IFile>((fileStat, filePath) => {
            return fileStat.isFile() ? new FsFile(filePath, this.factory) : null;
        });
    }

    public async moveTo(v: any) {
        const dir = v as IDirectory;
        if (typeof dir.moveTo == 'function') {
            const childDirs = await this.findDirectories();
            for (const r of childDirs) {
                await r.moveTo(
                    this.factory.buildDirectory(
                        [dir.path, r.name].join('/')
                    )
                );
            }

            const childFiles = await this.findFiles();
            const tasks = childFiles.map(r => {
                return r.moveTo(
                    this.factory.buildFile(
                        [dir.path, r.name].join('/')
                    )
                );
            });
            await Promise.all(tasks);

            await this.remove();
        } else {
            await super.moveTo(v);
        }
    }

    public async read() {
        return readdir(this.path);
    }

    public async remove() {
        await rm(this.path, {
            force: true,
            recursive: true,
        });
    }

    protected async doCopyTo(opts: CopyOption) {
        const files = await this.findFiles();
        for (const r of files) {
            await r.copyTo({
                paths: [...opts.paths, r.name],
                isForce: opts.isForce
            });
        }

        const dirs = await this.findDirectories() as IDirectory[];
        for (const r of dirs) {
            const dstDir = this.factory.buildDirectory(...opts.paths, r.name);
            const exists = await dstDir.exists();
            if (!exists)
                await dstDir.create();

            await r.copyTo({
                paths: [dstDir.path],
                isForce: opts.isForce
            });
        }
    }

    private async scan<T extends IFileEntry>(buildFunc: (fileStat: Stats, filePath: string) => T) {
        const isExist = await this.exists();
        if (!isExist)
            return [];

        const children: T[] = [];
        const filenames = await readdir(this.path);
        for (const r of filenames) {
            const filePath = join(this.path, r);
            const fileStat = await stat(filePath);
            const child = buildFunc(fileStat, filePath);
            if (child)
                children.push(child);
        }
        return children;
    }
}