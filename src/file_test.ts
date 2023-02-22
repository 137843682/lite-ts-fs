import { deepStrictEqual, strictEqual } from 'assert';
import { join } from 'path';

import { File as Self } from './file';

describe('src/file.ts', () => {
    describe('.copyTo(opts: string | string[] | CopyOption)', () => {
        it('ok', async () => {
            const sourceFile = new Self(
                join('src', 'index.ts'),
                null,
            );

            await sourceFile.copyTo({
                paths: ['src', 'index-test'],
                isForce: true
            });

            const targetFile = new Self(
                join('src', 'index-test'),
                null,
            );
            const targetExists = await targetFile.exists();
            strictEqual(targetExists, true);

            await targetFile.remove();
        });
    });

    describe('.moveTo(v: any)', () => {
        it('ok', async () => {
            const sourceFile = new Self('file-move-to-src.txt', null);
            await sourceFile.write('123');

            await sourceFile.moveTo('file-move-to-dst.txt');

            const oldExists = await sourceFile.exists();
            strictEqual(oldExists, false);

            const targetFile = new Self('file-move-to-dst.txt', null);
            const targetExists = await targetFile.exists();
            strictEqual(targetExists, true);

            await targetFile.remove();
        });
    });

    describe('.read()', () => {
        it('ok', async () => {
            const self = new Self('file-read.json', null);
            await self.write(`{"id":"123"}`);

            const res = await self.read<{ id: string; }>();
            deepStrictEqual(res, {
                id: '123'
            });

            await self.remove();
        });
    });

    describe('.readString()', () => {
        it('ok', async () => {
            const self = new Self('file-readString.txt', null);
            await self.write('123');

            const res = await self.readString();
            strictEqual(res, '123');

            await self.remove();
        });
    });

    describe('.readYaml()', () => {
        it('ok', async () => {
            const self = new Self('file-test.yaml', null);
            await self.write(`service: fs`);

            const res = await self.readYaml<{ service: string; }>();
            deepStrictEqual(res, {
                service: 'fs'
            });

            await self.remove();
        });
    });
});