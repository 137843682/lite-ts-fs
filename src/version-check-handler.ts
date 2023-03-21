import { VersionHandlerBase } from './version-handler-base';

const reg = /\d+\.\d+\.\d+/;

export class VersionCheckHandler extends VersionHandlerBase {
    public async handle() {
        const ok = reg.test(this.version);
        if (!ok)
            throw new Error(`无效版本号: ${this.version}`);

        return super.handle();
    }
}