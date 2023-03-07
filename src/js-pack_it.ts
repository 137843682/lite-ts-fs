import { FileFactory } from './file-factory';
import { JsPack } from './js-pack';

describe('src/jspack.ts', () => {
    it('getDirContent', async () => {
        const jspack = new JsPack();
        const content = await jspack.getDirContent('dist');
        const fileFactory = new FileFactory();
        const pkg = await fileFactory.buildFile('package.json').read<{ name: string; }>();
        await fileFactory.buildFile(`${pkg.name}.d.ts`).write(
            content.join('\n').replace(/export\ /g, '')
                .replace(/moment\.unitOfTime\.StartOf/g, 'string')
        );

        const licenseFile = fileFactory.buildFile(`${pkg.name}.min.js.LICENSE.txt`);
        const exists = await licenseFile.exists();
        if (exists)
            await licenseFile.remove();
    });
});