import nodePath from "node:path";
import nodeFs, { Stats } from "node:fs";
import nodeFsPromise from "node:fs/promises";

/**
 *
 * @param file
 * @param cwd
 */
export function normalize(file: string, cwd: string = process.cwd()): string {
    if (nodePath.isAbsolute(file)) {
        return file;
    }

    return nodePath.join(cwd, file);
}

/**
 * Buffer to string
 * @param buf
 */
export function buf2str(buf: Buffer): string {
    return buf.toString(`utf-8`);
}

/**
 *
 * @param path
 */
export function checkExist(path: string): boolean | never {
    try {
        nodeFs.openSync(normalize(path), "r");
        return true;
    } catch (e) {
        return false;
    }
}

/**
 *
 * @param path
 * @param data
 */
// eslint-disable-next-line
export const writeFile = async (path: string, data: any) => {
    await nodeFsPromise.writeFile(
        normalize(path),
        typeof data === "string" ? data : JSON.stringify(data, null, 4)
    );
};

/**
 *
 * @param path
 * @param data
 */
// eslint-disable-next-line
export const writeFileSync = (path: string, data: any) => {
    nodeFs.writeFileSync(
        normalize(path),
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
    folder = normalize(folder);
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
    const fullSrc = normalize(src);
    const fullDest = normalize(dest);

    traverse(fullSrc, (file, stats) => {
        const relativePath = nodePath.relative(fullSrc, file);
        const newPath = nodePath.resolve(fullDest, relativePath);
        if (stats.isFile()) {
            nodeFs.writeFileSync(newPath, nodeFs.readFileSync(file));
        } else if (stats.isDirectory() && !nodeFs.existsSync(newPath)) {
            nodeFs.mkdirSync(newPath);
        } else if (stats.isSymbolicLink()) {
            // Skip
        }
        return true;
    });
}

/**
 * Delete folder
 * @param src
 */
export function rmdirSync(src: string, removeRoot = true) {
    const fullSrc = normalize(src);
    const dirs: string[] = [];

    traverse(fullSrc, (file, stats) => {
        if (stats.isFile()) {
            nodeFs.unlinkSync(file);
        } else if (stats.isDirectory()) {
            dirs.push(file);
        }

        return true;
    });

    dirs.reverse().forEach((dir) => nodeFs.rmdirSync(dir));

    if (removeRoot) {
        nodeFs.rmdirSync(src);
    }
}
