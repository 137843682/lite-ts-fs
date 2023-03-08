import { JsPack } from './js-pack';

describe('src/jspack.ts', () => {
    it('getDirContent', async () => {
        const jsPack = new JsPack();
        await jsPack.pack();
    });
});