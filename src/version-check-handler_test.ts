import { ok, strictEqual } from 'assert';

import { VersionCheckHandler as Self } from './version-check-handler';
import { VersionHandlerBase } from './version-handler-base';

let count = 0;

class NextHandler extends VersionHandlerBase {
    public async handle(): Promise<void> {
        count = 100;
    }
}

describe('src/version-check-handler_test.ts', () => {
    describe('.handle(): Promise<void>', () => {
        it('无效版本号', async () => {
            const self = new Self('a');
            let err: Error;
            try {
                await self.handle();
            } catch (ex) {
                err = ex;
            }
            ok(err);
            strictEqual(err.message, '无效版本号: a');
        });

        it('ok', async () => {
            await new Self('1.0.0').setNext(
                new NextHandler('1.0.0')
            ).handle();
            strictEqual(count, 100);
        });
    });
});