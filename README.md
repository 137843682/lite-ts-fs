# 文件操作

![Version](https://img.shields.io/badge/version-1.2.0-green.svg)

## 安装
```
npm install lite-ts-fs
```

## 使用

```typescript
import { FileFactory } from 'lite-ts-fs';

const factory = new FileFactory();
const file = await factory.buildFile('./test.txt');
await file.readString(); // 读取文件内容

const dir = await factory.buildDirectory('./test');
await dir.create(true); // 创建文件，参数为true时递归创建
```
### 构建库.d.ts文件使用方法
```typescript
import { Jspack,FileFactory } from 'lite-ts-fs';

const jspack = new Jspack();
const content = await jspack.getDirContent('dist');
const fileFactory = new FileFactory();
const pkg = await fileFactory.buildFile('package.json').read<{ name: string; }>();
await fileFactory.buildFile(`${pkg.name}.d.ts`).write(
    content.join('\n').replace(/export\ /g, '')
        .replace(/moment\.unitOfTime\.StartOf/g, 'string')
);
```
