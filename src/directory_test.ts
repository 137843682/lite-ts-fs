import { notStrictEqual, strictEqual } from 'assert';
import { mkdir } from 'fs/promises';
import { join } from 'path';

import { FsDirectory as Self } from './directory';
import { FsFileFactory } from './file-factory';

describe('src/directory.ts', () => {
    describe('.copyTo(opts: string | string[] | CopyOption)', () => {
        it('ok', async () => {
            const fsFactory = new FsFileFactory();
            const self = new Self('src', fsFactory);

            const copyDir = new Self('src-copy', null);
            await copyDir.create();

            await self.copyTo('src-copy');

            const exists = await copyDir.exists();
            strictEqual(exists, true);

            await copyDir.remove();
        });
    });

    describe('.create()', () => {
        it('ok', async () => {
            const dir = join('./test-dir');
            const self = new Self(dir, null);
            await self.create();

            const res = await self.exists();
            strictEqual(res, true);

            await self.remove();
        });

        it('已存在', async () => {
            const dirPath = 'dir-exists';
            await mkdir(dirPath);

            const self = new Self(dirPath, null);
            await self.create();

            const res = await self.exists();
            strictEqual(res, true);

            await self.remove();
        });
    });

    describe('.findDirectories()', () => {
        it('ok', async () => {
            const dir = join('.');
            const self = new Self(dir, null);
            const res = await self.findDirectories();
            notStrictEqual(res.length, 0);
        });
    });

    describe('.findFiles()', () => {
        it('ok', async () => {
            const dir = join('./src');
            const self = new Self(dir, null);
            const res = await self.findFiles();
            notStrictEqual(res.length, 0);
        });
    });

    describe('.moveTo()', () => {
        it('ok', async () => {
            const fsFactory = new FsFileFactory();
            const sourceDir = new Self('test-dir-src', fsFactory);
            const sourceSubDir = new Self(
                join(sourceDir.path, '1'),
                fsFactory,
            );
            await sourceSubDir.create(true);

            const targetDir = new Self(
                'target-dir',
                fsFactory,
            );
            await targetDir.create();

            await sourceDir.moveTo(targetDir.path);

            const sourceSubExists = await sourceSubDir.exists();
            strictEqual(sourceSubExists, false);

            const targetSubDir = new Self(
                join(targetDir.path, '1'),
                fsFactory,
            );
            const targetExists = await targetSubDir.exists();
            strictEqual(targetExists, true);

            await targetDir.remove();
        });
    });

    describe('.read()', () => {
        it('ok', async () => {
            const self = new Self('src', null);
            const res = await self.read();
            notStrictEqual(res.length, 0);
        });
    });
});