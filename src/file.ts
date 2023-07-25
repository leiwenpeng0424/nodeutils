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

/**
 * Traverse directory, visitor return truthy value will enter next level.
 * @param dir
 * @param visitor
 */
export function traverse(
    dir: string,
    visitor: (file: string, stats: Stats) => boolean
) {
    const stats = nodeFs.statSync(dir);
    if (stats.isDirectory() && visitor(dir, stats)) {
        for (const subDirName of nodeFs.readdirSync(dir)) {
            traverse(nodePath.resolve(dir, subDirName), visitor);
        }
    } else if (stats.isFile()) {
        visitor(dir, stats);
    }
}

/**
 * Find file in folder recursively
 * @param file
 * @param folder
 * @param ignore
 */
export function findFile(
    file: string,
    folder: string,
    ignore = /(node_modules|\.git|\.idea)/
) {
    const fileNameReg = new RegExp(`\/${file}$`, `gm`);
    folder = fullPath(folder);
    let tFile: string | undefined;

    traverse(
        folder, //
        (file) => {
            if (fileNameReg.test(file)) {
                tFile = file;
                return false;
            }

            return !ignore.test(file);
        }
    );

    return tFile;
}

/**
 * Copy from source to destination.
 * @param src
 * @param dest
 */
export function copySync(src: string, dest: string) {
    const fullSrc = fullPath(src);
    const fullDest = fullPath(dest);

    traverse(fullSrc, (file, stats) => {
        const relativePath = nodePath.relative(fullSrc, file);
        const newPath = nodePath.resolve(fullDest, relativePath);
        if (stats.isFile()) {
            nodeFs.writeFileSync(newPath, nodeFs.readFileSync(file));
        } else if (stats.isDirectory()) {
            nodeFs.mkdirSync(newPath);
        } else if (stats.isSymbolicLink()) {
            //
        }
        return true;
    });
}
