import { IFile } from './i-file';
import { VersionHandlerBase } from './version-handler-base';

export class VersionJsonFileHandler extends VersionHandlerBase {
    public constructor(
        private m_File: IFile,
        version: string
    ) {
        super(version);
    }

    public async handle() {
        const isExist = await this.m_File.exists();
        if (!isExist)
            return;

        const entry = await this.m_File.read<{
            version: string;
        }>();
        entry.version = this.getVersion(entry.version);
        await this.m_File.write(entry);
    }
}