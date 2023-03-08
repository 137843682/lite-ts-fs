import { JsPack } from './js-pack';

describe('src/jspack.ts', () => {
    it('getDirContent', async () => {
        const jspack = new JsPack();
        await jspack.build();
    });
});