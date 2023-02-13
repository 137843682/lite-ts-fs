import { notStrictEqual, strictEqual } from 'assert';
import { join } from 'path';

import { Directory as Self } from './directory';
import { FileFactory } from './file-factory';

describe('src/directory.ts', () => {
    describe('.copyTo(opts: string | string[] | CopyOption)', () => {
        it('ok', async () => {
            const fsFactory = new FileFactory();
            const self = new Self(fsFactory, join('src'));

            const copyDir = new Self(null, 'src-copy');
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
            const self = new Self(null, dir);
            await self.create();

            const res = await self.exists();
            strictEqual(res, true);

            await self.remove();
        });
    });

    describe('.findDirectories()', () => {
        it('ok', async () => {
            const dir = join('.');
            const self = new Self(null, dir);
            const res = await self.findDirectories();
            notStrictEqual(res.length, 0);
        });
    });

    describe('.findFiles()', () => {
        it('ok', async () => {
            const dir = join('./src');
            const self = new Self(null, dir);
            const res = await self.findFiles();
            notStrictEqual(res.length, 0);
        });
    });

    describe('.moveTo()', () => {
        it('ok', async () => {
            const fsFactory = new FileFactory();
            const sourceDir = new Self(fsFactory, 'source-dir');
            const sourceSubDir = new Self(fsFactory, join('source-dir', '1'));
            await sourceSubDir.create(true);

            const targetDir = new Self(fsFactory, 'target-dir');
            await targetDir.create();

            await sourceDir.moveTo(targetDir.path);

            const sourceSubExists = await sourceSubDir.exists();
            strictEqual(sourceSubExists, false);

            const targetSubDir = new Self(fsFactory, join(targetDir.path, '1'));
            const targetExists = await targetSubDir.exists();
            strictEqual(targetExists, true);

            await targetDir.remove();
        });
    });

    describe('.read()', () => {
        it('ok', async () => {
            const self = new Self(null, join('src'));
            const res = await self.read();
            notStrictEqual(res.length, 0);
        });
    });
});