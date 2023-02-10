import { deepStrictEqual, strictEqual } from 'assert';

import { FsFile as Self } from './file';

describe('src/file.ts', () => {
    describe('.moveTo(v: any)', () => {
        it('ok', async () => {
            const sourceFile = new Self(null, './file-test.txt');
            await sourceFile.write('123');

            await sourceFile.moveTo('./file-test-move.txt');

            const oldExists = await sourceFile.exists();
            strictEqual(oldExists, false);

            const targetFile = new Self(null, './file-test-move.txt');
            const targetExists = await targetFile.exists();
            strictEqual(targetExists, true);

            await targetFile.remove();
        });
    });

    describe('.read()', () => {
        it('ok', async () => {
            const self = new Self(null, './file-test.json');
            await self.write(`{"id":"123"}`);

            const res = await self.read<{ id: string; }>();
            deepStrictEqual(res, {
                id: "123"
            });

            await self.remove();
        });
    });

    describe('.readString()', () => {
        it('ok', async () => {
            const self = new Self(null, './file-test.txt');
            await self.write('123');

            const res = await self.readString();
            strictEqual(res, '123');

            await self.remove();
        });
    });

    describe('.readYaml()', () => {
        it('ok', async () => {
            const self = new Self(null, './file-test.yaml');
            await self.write(`service: fs`);

            const res = await self.readYaml<{ service: string; }>();
            deepStrictEqual(res, {
                service: 'fs'
            });

            await self.remove();
        });
    });
});