import nodePath from "node:path";
import nodeFs, { Stats } from "node:fs";
import nodeFsPromise from "node:fs/promises";

export function checkAccess(file: string): void {
    nodeFs.accessSync(fullPath(file));
}

export function fullPath(file: string, cwd: string = process.cwd()): string {
    if (nodePath.isAbsolute(file)) {
        return file;
    }

    return nodePath.join(cwd, file);
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

export const writeFile = async (path: string, data: any) => {
    await nodeFsPromise.writeFile(
        fullPath(path),
        typeof data === "string" ? data : JSON.stringify(data, null, 4)
    );
};

export const writeFileSync = (path: string, data: any) => {
    nodeFs.writeFileSync(
        fullPath(path),
        typeof data === "string" ? data : JSON.stringify(data, null, 4)
    );
};

export interface IFindFileOptions {
    ignore?: string;
    levels?: number;
}

export async function findFile(
    file: string,
    folder: string,
    options: IFindFileOptions = {}
) {
    folder = fullPath(folder);

    if (!checkExist(folder)) {
        throw Error(`Folder "${folder}" is not exist!`);
    }

    if (!options?.ignore) {
        options.ignore = `(node_modules|git|idea|vscode)`;
    }

    if (options?.levels == null) {
        options.levels = Infinity;
    }

    const fileNameReg = new RegExp(`^${file}$`, `gm`);
    const ignoreNameReg = new RegExp(options.ignore, `gm`);

    const scanDir = async (dir: string) => {
        return await nodeFsPromise.readdir(dir);
    };

    const filterFile = async (file: string): Promise<boolean> => {
        return fileNameReg.test(file);
    };

    const filterDir = async (dir: string): Promise<boolean> => {
        return ignoreNameReg.test(dir);
    };

    const filesSatisfied: string[] = [];

    const loop = async (dir: string, level: number) => {
        const files = await scanDir(dir);

        for await (const file of files) {
            const _file = nodePath.join(dir, file);
            const fileStat = await nodeFsPromise.stat(_file);

            if (fileStat.isFile() && (await filterFile(file))) {
                filesSatisfied.push(nodePath.join(dir, file));
            }

            const nextDir = nodePath.join(dir, file);

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

/**  */
export function traverseDir(
    dir: string,
    handler: (file: string, stats: Stats) => boolean
) {
    const stats = nodeFs.statSync(dir);
    if (stats.isDirectory() && handler(dir, stats)) {
        nodeFs.readdirSync(dir).forEach((subFile) => {
            traverseDir(nodePath.resolve(dir, subFile), handler);
        });
    } else if (stats.isFile()) {
        handler(dir, stats);
    }
}

/** Copy dir */
export function copySync(src: string, dest: string) {
    const fullSrc = fullPath(src);
    const fullDest = fullPath(dest);

    traverseDir(fullSrc, (file, stats) => {
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
