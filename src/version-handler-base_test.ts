import { strictEqual } from 'assert';

import { VersionHandlerBase } from './version-handler-base';

class VersionHandler extends VersionHandlerBase {
    public version: string;

    public async handle(): Promise<void> {
        this.version = this.getVersion('1.2.3');
    }
}

class TestHandler extends VersionHandlerBase {
    public constructor(private m_Action: (handler: VersionHandlerBase) => void) {
        super('');
    }

    public async handle(): Promise<void> {
        this.m_Action(this);
        return super.handle();
    }
}

describe('src/version-handler-base.ts', () => {
    describe('getVersion(version: string): string', () => {
        it('最后一位(升级)', async () => {
            const self = new VersionHandler('0.0.1');
            await self.handle();
            strictEqual(self.version, '1.2.4');
        });

        it('中间一位(升级)', async () => {
            const self = new VersionHandler('0.1.0');
            await self.handle();
            strictEqual(self.version, '1.3.3');
        });

        it('第一位(升级)', async () => {
            const self = new VersionHandler('1.0.0');
            await self.handle();
            strictEqual(self.version, '2.2.3');
        });

        it('替换', async () => {
            const self = new VersionHandler('1.1.1');
            await self.handle();
            strictEqual(self.version, '1.1.1');
        });
    });

    describe('.handle(): Promise<void>', (): void => {
        it('ok', async (): Promise<void> => {
            let count = 0;
            await new TestHandler((): void => {
                count++;
            }).setNext(
                new TestHandler((): void => {
                    count += 2;
                })
            ).setNext(
                new TestHandler((): void => {
                    count += 3;
                })
            ).handle();
            strictEqual(count, 6);
        });

        it('first break', async (): Promise<void> => {
            let count = 0;
            await new TestHandler((self: VersionHandlerBase): void => {
                count++;
                self.break = true;
            }).setNext(
                new TestHandler((): void => {
                    count += 2;
                })
            ).setNext(
                new TestHandler((): void => {
                    count += 3;
                })
            ).handle();
            strictEqual(count, 1);
        });

        it('second break', async (): Promise<void> => {
            let count = 0;
            await new TestHandler((): void => {
                count++;
            }).setNext(
                new TestHandler((self: VersionHandlerBase): void => {
                    count += 2;
                    self.break = true;
                })
            ).setNext(
                new TestHandler((): void => {
                    count += 3;
                })
            ).handle();
            strictEqual(count, 3);
        });
    });
});