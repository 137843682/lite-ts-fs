import { FileFactory } from './file-factory';
import { VersionCheckHandler } from './version-check-handler';
import { VersionJsonFileHandler } from './version-json-file-handler';
import { VersionReadmeHandler } from './version-readme-handler';

export function tsServerVersion() {
    const ioFactory = new FileFactory();
    const readmeFile = ioFactory.buildFile(__dirname, '..', '..', '..', 'README.md');
    const packageJSONFile = ioFactory.buildFile(__dirname, '..', '..', '..', 'package.json');
    const packageLockJSONFile = ioFactory.buildFile(__dirname, '..', '..', '..', 'package-lock.json');
    new VersionCheckHandler(process.argv[2]).setNext(
        new VersionReadmeHandler(readmeFile, process.argv[2])
    ).setNext(
        new VersionJsonFileHandler(packageJSONFile, process.argv[2])
    ).setNext(
        new VersionJsonFileHandler(packageLockJSONFile, process.argv[2])
    ).handle();
}