import json5 from "json5";
import nodeFs from "node:fs";
import {
    buf2str,
    checkExist,
    normalize,
    writeFile,
    writeFileSync,
} from "./file";

/**
 * Is your string a valid json string ?
 **/
export function isValidJSON(input: string): boolean {
    try {
        JSON.parse(input);
        return true;
    } catch (e) {
        return false;
    }
}

/**
 *  Read json data from .json file.
 **/
export async function readJSON<T = unknown>(file: string): Promise<T> {
    console.log("asd");

    return new Promise((resolve) => {
        let buf = "";

        nodeFs
            .createReadStream(file, {
                flags: "r",
                encoding: "utf-8",
            })
            .on("data", (d) => {
                buf += d.toString();
            })
            .on("end", () => {
                resolve(json5.parse(buf));
            });
    });
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

/**
 * Write JSON data to file.
 **/
export async function writeJSON(path: string, json: object): Promise<void> {
    if (!checkExist(normalize(path))) {
        throw Error(`Write destination \`${path}\` is not exist!`);
    }

    try {
        const _json = JSON.stringify(json, null, 4);
        await writeFile(normalize(path), _json);
    } catch (e) {
        console.error(`Error while stringify json`);
    }
}

/**
 * Write JSON data to file.
 **/
export function writeJSONSync(path: string, json: object): void {
    if (!checkExist(normalize(path))) {
        throw Error(`Write destination \`${path}\` is not exist!`);
    }

    try {
        const _json = JSON.stringify(json, null, 4);
        writeFileSync(normalize(path), _json);
    } catch (e) {
        console.error(`Error while stringify json`);
    }
}
