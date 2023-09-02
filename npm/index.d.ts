/// <reference types="node" />

import { Stats } from 'node:fs';

/**
 * Buffer to string
 * @param buf
 */
declare function buf2str(buf: Buffer): string;

/**
 *
 * @param path
 */
declare function checkExist(path: string): boolean | never;

export declare const colors: Record<TColorsAndStyle, (text: string) => string>;

/**
 * Copy from source to destination.
 * @param src
 * @param dest
 */
declare function copySync(src: string, dest: string): void;

declare namespace file {
    export {
        normalize_2 as normalize,
        buf2str,
        checkExist,
        traverse,
        findFile,
        copySync,
        rmdirSync,
        writeFile,
        writeFileSync
    }
}
export { file }

/**
 * Find file in folder recursively
 * @param file
 * @param folder
 * @param ignore
 */
declare function findFile(file: string, folder: string, ignore?: RegExp): string | undefined;

declare interface IImportOptions {
    cwd?: string;
    nodeModule?: string;
}

/**
 * @param id
 * @param options
 */
declare function import_<T = unknown>(id: string, options?: IImportOptions): T;

/**
 * @param importModule
 */
declare function interopDefault<T = unknown>(importModule: any): T;

/**
 * Is your string a valid json string ?
 **/
declare function isValidJSON(input: string): boolean;

/**
 * @param input
 */
declare function isValidThirdLibName(input: string): boolean;

declare namespace json {
    export {
        isValidJSON,
        readJSON,
        readJSONSync,
        writeJSON,
        writeJSONSync
    }
}
export { json }

declare namespace m {
    export {
        interopDefault,
        nativeRequire,
        isValidThirdLibName,
        normalize,
        transpileAndRequire,
        import_
    }
}
export { m }

/**
 * 计算时间间隔，并转换单位，可以通过 format 来格式化输出
 *
 * @example
 *  input     | output
 *  12        | 12ms
 *  120000    | 2m
 *  1200000   | 20m
 *  12000000  | 3.33h
 *  120000000 | 1.39d
 *
 * @param interval
 * @param options
 */
export declare function ms(interval: number, options?: {
    precision?: number;
}): string;

/**
 * @param id
 * @param requireUrl
 */
declare function nativeRequire<T = any>(id: string, requireUrl?: string): T;

/**
 * @param id
 */
declare function normalize(id: string): string;

/**
 *
 * @param file
 * @param cwd
 */
declare function normalize_2(file: string, cwd?: string): string;

/**
 * Minimal nodejs command arguments parser
 * @param input
 */
export declare function parser<T extends Record<string, any>>(input: string[]): T;

/**
 *  Read json data from .json file.
 **/
declare function readJSON<T = unknown>(file: string): Promise<T>;

declare function readJSONSync<T = unknown>(file: string): T;

/**
 * Delete folder
 * @param src
 */
declare function rmdirSync(src: string, removeRoot?: boolean): void;

declare type TColorsAndStyle = TSupportColor | TSupportStyle | TSupportBgColor;

export declare class Terminal {
    private x;
    private y;
    private maxCols;
    private readonly stdin;
    private readonly stdout;
    private readonly rl;
    constructor();
    private _write;
    nextLine(count?: number): this;
    clearLine(cb?: () => void): this;
    writeSameLine(content: string): this;
    writeLine(content: string): this;
    clearScreen(): this;
    box(content: string | string[]): this;
}

/**
 * Compile file, and create node require.
 **/
declare function transpileAndRequire<T>(file: string, requireUrl: string): T | undefined;

/**
 * Traverse directory, visitor return truthy value will enter next level.
 * @param dir
 * @param visitor
 */
declare function traverse(dir: string, visitor: (file: string, stats: Stats) => boolean): void;

declare type TSupportBgColor = "bgBlack" | "bgRed" | "bgGreen" | "bgYellow" | "bgBlue" | "bgMagenta" | "bgCyan" | "bgWhite";

declare type TSupportColor = "black" | "red" | "green" | "yellow" | "cyan" | "blue" | "magenta" | "white" | "gray" | "brightRed" | "brightGreen" | "brightYellow" | "brightBlue" | "brightMagenta" | "brightCyan" | "brightWhite";

declare type TSupportStyle = "bold" | "underline" | "reversed";

/**
 *
 * @param path
 * @param data
 */
declare const writeFile: (path: string, data: any) => Promise<void>;

/**
 *
 * @param path
 * @param data
 */
declare const writeFileSync: (path: string, data: any) => void;

/**
 * Write JSON data to file.
 **/
declare function writeJSON(path: string, json: object): Promise<void>;

/**
 * Write JSON data to file.
 **/
declare function writeJSONSync(path: string, json: object): void;

export { }
