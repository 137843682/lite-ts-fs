import { Mock } from 'lite-ts-mock';

import { File } from './file';
import { VersionJsonFileHandler } from './version-json-file-handler';

describe('src/version-json-file-handler.ts', (): void => {
    describe('.handle(): Promise<void>', (): void => {
        it('ok', async (): Promise<void> => {
            const mockFile = new Mock<File>();

            mockFile.expectReturn(
                r => r.exists(),
                true
            );

            mockFile.expectReturn(
                r => r.read(),
                {
                    version: '1.1.1'
                }
            );

            const version = '0.0.1';
            mockFile.expected.write(
                JSON.stringify({
                    version: '1.1.2'
                }, null, '\t'),
            );

            await new VersionJsonFileHandler(mockFile.actual, version).handle();
        });
    });
});