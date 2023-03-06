import { join } from 'path';
import { FileFactoryBase } from './file-factory-base';

export class Jspack {
    private static exportReg = /["|'](.*)["|']/;
    private static importReg = /import.*["|'](.*)["|']/;

    // 要过滤的行
    private static ignoreLine = 'export {};';
    // 已解析的文件
    private m_ParsedFiles: string[] = [];

    public constructor(private m_FsFactory: FileFactoryBase) { }

    /**
     * 解析整个目录，从该目录底下的 index.d.ts 的 export 内容一个一个解析过去
     * 
     * @param dirPath 目录地址
     * @returns 
     */
    public async getDirContent(dirPath: string) {
        const path = join(dirPath, 'index.d.ts');
        const indexTsFile = this.m_FsFactory.buildFile(path);
        const dirExists = await indexTsFile.exists();
        if (!dirExists || this.m_ParsedFiles.includes(path))
            return '';

        this.m_ParsedFiles.push(path);

        const indexTsFileContent = await indexTsFile.readString();
        const exportsArray = indexTsFileContent.split('\n');
        let content = '';
        for (const line of exportsArray) {
            const regRes = line.match(Jspack.exportReg);
            if (regRes && regRes[1]) {
                const paths = regRes[1].split('/');
                if (!paths[paths.length - 1].endsWith('.d.ts'))
                    paths[paths.length - 1] += '.d.ts';

                const filePath = join(dirPath, ...paths);
                if (this.m_ParsedFiles.includes(filePath))
                    continue;

                this.m_ParsedFiles.push(filePath);

                const file = this.m_FsFactory.buildFile(filePath);
                let fileText = await file.readString();
                fileText = await this.getFileContent(fileText, dirPath);
                content += fileText + '\n';
            } else if (line && line != Jspack.ignoreLine) {
                content += line + '\n';
            }
        }
        return content;
    }

    /**
     * 获取文件的内容，如果有 import 那么把指定文件的内容拼接起来
     * 
     * @param fileContent 
     * @param dirPath 
     * @returns 
     */
    public async getFileContent(fileContent: string, dirPath: string) {
        const arr = fileContent.split('\n');
        let content = '';
        for (const line of arr) {
            const regRes = line.match(Jspack.importReg);
            if (regRes && regRes[1]) {
                const paths = regRes[1].split('/');
                const dirExists = await this.m_FsFactory.buildDirectory(join(dirPath, ...paths)).exists();
                if (dirExists) {
                    content += await this.getDirContent(join(dirPath, ...paths)) + '\n';
                } else {
                    if (!paths[paths.length - 1].endsWith('.d.ts'))
                        paths[paths.length - 1] += '.d.ts';

                    const path = join(dirPath, ...paths);
                    if (this.m_ParsedFiles.includes(path))
                        continue;

                    const file = this.m_FsFactory.buildFile(path);
                    const fileExists = await file.exists();
                    if (!fileExists) {
                        const regRes = line.match(Jspack.exportReg);
                        if (regRes?.length && regRes[1].startsWith('lite-ts')) {
                            const exportDir = this.m_FsFactory.buildDirectory('node_modules', regRes[1], 'dist');
                            const isEexists = await exportDir.exists();
                            if (!isEexists)
                                console.log(`无法处理 ${line}, 找不到文件: ${file.path}, 已跳过`);

                            content += await this.getDirContent(join(exportDir.path)) + '\n';
                        } else {
                            console.log(`无法处理 ${line}, 找不到文件: ${file.path}, 已跳过`);
                        }
                        continue;
                    }

                    this.m_ParsedFiles.push(path);
                    let fileText = await file.readString();
                    if (fileText) {
                        fileText = await this.getFileContent(fileText, dirPath);
                        content += fileText + '\n';
                    }
                }
            } else if (line && line != Jspack.ignoreLine) {
                content += line + '\n';
            }
        }
        return content;
    }
}