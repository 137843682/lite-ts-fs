type NextType = VersionHandlerBase | (() => VersionHandlerBase);

export abstract class VersionHandlerBase {

    private m_Nexts: NextType[] = [];

    public break = false;

    public constructor(
        protected version: string,
    ) { }

    public async handle(): Promise<void> {
        if (this.break)
            return;

        for (const r of this.m_Nexts) {
            let handler = r instanceof VersionHandlerBase ? r : r();
            await handler.handle();
            if (handler.break)
                break;
        }
    }

    public setNext(next: NextType): this {
        this.m_Nexts.push(next);
        return this;
    }

    protected getVersion(version: string) {
        const parts = this.version.split('.').map(r => {
            return parseInt(r);
        });
        const total = parts.reduce((memo, r) => {
            return memo + r;
        }, 0);
        return total != 1 ? this.version : version.split('.').map((r, i) => {
            return parseInt(r) + parts[i];
        }).join('.');
    }
}