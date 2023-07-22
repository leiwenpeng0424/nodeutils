import json5 from "json5";
import nodeFs from "node:fs";
import nodeFsPromise from "node:fs/promises";
import {
    checkAccess,
    fullPath,
    buf2str,
    checkExist,
    writeFile,
    writeFileSync,
} from "./file";

export interface IReadFileOptions {
    format?: "JSON";
}

export interface IWriteFileOptions extends IReadFileOptions {
    force?: boolean;
}

export function isValidJSON(input: string): boolean {
    try {
        JSON.parse(input);
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
