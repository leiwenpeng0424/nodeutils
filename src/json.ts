import json5 from "json5";
import nodeFs, { type Stats } from "node:fs";
import nodeFsPromise from "node:fs/promises";
import nodePath from "node:path";

export function fullPath(file: string, cwd: string = process.cwd()) {
    if (nodePath.isAbsolute(file)) {
        return file;
    }

    return nodePath.join(cwd, file);
}

export interface IReadFileOptions {
    format?: "JSON";
}

export interface IWriteFileOptions extends IReadFileOptions {
    force?: boolean;
}

export interface IFindFileOptions {
    fullPath?: boolean;
    ignore?: string;
    levels?: number;
}

export function isValidJSON(input: string): boolean {
    try {
        JSON.parse(input);
        return true;
    } catch (e) {
        return false;
    }
}

export function checkAccess(file: string): void {
    nodeFs.accessSync(fullPath(file));
}

export function buf2str(buf: Buffer): string {
    return buf.toString(`utf-8`);
}

export function checkExist(path: string): boolean | never {
    try {
        nodeFs.openSync(fullPath(path), "r");
        return true;
    } catch (e) {
        return false;
    }
}

export async function readJSON<T = unknown>(file: string): Promise<T> {
    checkAccess(file);

    let content = await nodeFsPromise.readFile(fullPath(file), {
        encoding: "utf-8",
    });

    if (Buffer.isBuffer(content)) {
        content = buf2str(content); //
    }

    try {
        return json5.parse(content);
    } catch (e) {
        throw new Error(
            `json5.parse() error, while processing content from ${file}`
        );
    }
}

export function readJSONSync<T = unknown>(file: string): T {
    checkAccess(file);

    let content = nodeFs.readFileSync(fullPath(file), {
        encoding: "utf-8",
    });

    if (Buffer.isBuffer(content)) {
        content = buf2str(content); //
    }

    try {
        return json5.parse(content);
    } catch (e) {
        throw new Error(
            `json5.parse() error, while processing content from ${file}`
        );
    }
}

const writeFile = async (path: string, data: string) => {
    await nodeFsPromise.writeFile(
        fullPath(path),
        JSON.stringify(data, null, 4)
    );
};

const writeFileSync = (path: string, data: string) => {
    nodeFs.writeFileSync(fullPath(path), JSON.stringify(data, null, 4));
};

export async function writeJSON(
    path: string,
    json: object,
    options?: IWriteFileOptions
): Promise<void> {
    if (checkExist(fullPath(path)) || options?.force) {
        await writeFile(fullPath(path), JSON.stringify(json, null, 4));
    } else {
        throw Error(`File path "${path}" is not exist!`);
    }
}

export function writeJSONSync(
    path: string,
    json: object,
    options?: IWriteFileOptions
): void {
    if (checkExist(fullPath(path)) || options?.force) {
        writeFileSync(fullPath(path), JSON.stringify(json, null, 4));
    } else {
        throw Error(`File path "${path}" is not exist!`);
    }
}

export async function findFile(
    file: string,
    folder: string,
    options: IFindFileOptions = {}
) {
    folder = fullPath(folder);

    if (checkExist(folder)) {
        throw Error(`Folder "${folder}" is not exist!`);
    }

    if (!options?.ignore) {
        options.ignore = `^node_modules`;
    }

    if (options?.levels == null) {
        options.levels = Infinity;
    }

    const fileNameReg = new RegExp(file, `gm`);
    const ignoreNameReg = new RegExp(options.ignore, `gm`);

    const scanDir = async (dir: string) => {
        return await nodeFsPromise.readdir(dir);
    };

    const filterFile = async (file: string): Promise<boolean> => {
        return fileNameReg.test(file);
    };

    /**
     * 过滤目录
     * @param dir
     */
    const filterDir = async (dir: string): Promise<boolean> => {
        return ignoreNameReg.test(dir);
    };

    const filesSatisfied: string[] = [];

    /**
     * 遍历
     * @param dir
     * @param level
     */
    const loop = async (dir: string, level: number) => {
        /**
         * 扫描目录
         */
        const files = await scanDir(dir);

        for await (const file of files) {
            const fileStat = await nodeFsPromise.stat(nodePath.join(dir, file));

            if (fileStat.isFile() && (await filterFile(file))) {
                filesSatisfied.push(
                    options?.fullPath ? nodePath.join(dir, file) : file
                );
            }

            const nextDir = nodePath.join(dir, file);

            // 目录，未过滤，非SymbolicLink，层级在允许的范围内
            if (fileStat.isDirectory() && !(await filterDir(file))) {
                if (options.levels != null && level >= options.levels) {
                    break;
                }

                await loop(nextDir, level + 1);
            }
        }
    };

    await loop(folder, 1);

    return filesSatisfied;
}

/*
  遍历文件夹
*/
export function loopDir(
    dir: string,
    handler: (file: string, stats: Stats) => boolean
) {
    const stats = nodeFs.statSync(dir);
    if (stats.isDirectory() && handler(dir, stats)) {
        nodeFs.readdirSync(dir).forEach((subFile) => {
            loopDir(nodePath.resolve(dir, subFile), handler);
        });
    } else if (stats.isFile()) {
        handler(dir, stats);
    }
}

export interface ICopyOptions {
    removeSource?: boolean;
    force?: boolean;
}

/**
  拷贝文件夹（异步）
*/
export async function copy(
    src: string,
    dest: string,
    CopyOptions: ICopyOptions = {}
) {
    // TODO
    const fullSrc = fullPath(src);
    const fullDest = fullPath(dest);
}

/**
  拷贝文件夹（同步）
*/
export function copySync(
    src: string,
    dest: string,
    CopyOptions: ICopyOptions = {}
) {
    const fullSrc = fullPath(src);
    const fullDest = fullPath(dest);

    loopDir(fullSrc, (file, stats) => {
        const relativePath = nodePath.relative(fullSrc, file);
        const newPath = nodePath.resolve(fullDest, relativePath);
        if (stats.isFile()) {
            nodeFs.writeFileSync(newPath, nodeFs.readFileSync(file));
        } else if (stats.isDirectory()) {
            nodeFs.mkdirSync(newPath);
        }
        return true;
    });
}
