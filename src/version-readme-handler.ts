import { IFile } from './i-file';
import { VersionHandlerBase } from './version-handler-base';

const reg = /version-(\d+\.\d+\.\d+)-green/;

export class VersionReadmeHandler extends VersionHandlerBase {
    public constructor(
        private m_File: IFile,
        version: string,
    ) {
        super(version);
    }

    public async handle() {
        let text = await this.m_File.readString();
        text = text.replace(reg, (text, match: string): string => {
            const version = this.getVersion(match);
            return text.replace(match, version);
        });
        await this.m_File.write(text);
    }
}