import json5 from "json5";
import nodeFs from "node:fs";
import nodeFsPromise from "node:fs/promises";
import {
    buf2str,
    checkExist,
    normalize,
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
    await nodeFsPromise.access(file);

    let content = await nodeFsPromise.readFile(normalize(file), {
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
    nodeFs.openSync(file, "r");

    let content = nodeFs.readFileSync(normalize(file), {
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
    if (checkExist(normalize(path)) || options?.force) {
        await writeFile(normalize(path), JSON.stringify(json, null, 4));
    } else {
        throw Error(`File path "${path}" is not exist!`);
    }
}

export function writeJSONSync(
    path: string,
    json: object,
    options?: IWriteFileOptions
): void {
    if (checkExist(normalize(path)) || options?.force) {
        writeFileSync(normalize(path), JSON.stringify(json, null, 4));
    } else {
        throw Error(`File path "${path}" is not exist!`);
    }
}
