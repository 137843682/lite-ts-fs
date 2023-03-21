import { Mock } from 'lite-ts-mock';

import { File } from './file';
import { VersionReadmeHandler } from './version-readme-handler';

describe('src/version-readme-handler.ts', () => {
    describe('.handle(): Promise<void>', () => {
        it('ok', async (): Promise<void> => {
            const mockFile = new Mock<File>();

            mockFile.expectReturn(
                r => r.readString(),
                '# ![Version](https://img.shields.io/badge/version-1.1.1-green.svg)'
            );

            mockFile.expected.write('# ![Version](https://img.shields.io/badge/version-1.1.2-green.svg)');

            await new VersionReadmeHandler(mockFile.actual, '0.0.1').handle();
        });
    });
});