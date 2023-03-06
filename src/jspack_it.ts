import { FileFactory } from './file-factory';
import { Jspack } from './jspack';

describe('src/jspack.ts', () => {
    describe('.callWithoutThrow<T>(req: AjaxRpcCallOption)', () => {
        it('getDirContent', async () => {
            const fileFactory = new FileFactory();
            const jspack = new Jspack(fileFactory);
            const content = await jspack.getDirContent('dist');

            const pkg = await fileFactory.buildFile('package.json').read<{ name: string; }>();

            await fileFactory.buildFile(`${pkg.name}.d.ts`).write(
                content.replace(/export\ /g, '')
                    .replace(/moment\.unitOfTime\.StartOf/g, 'string')
            );

            const licenseFile = fileFactory.buildFile(`${pkg.name}.min.js.LICENSE.txt`);
            const exists = await licenseFile.exists();
            if (exists)
                await licenseFile.remove();
        });

    });
});