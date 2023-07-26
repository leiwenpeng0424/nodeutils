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
        normalize,
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

/**
 * 获取完整的路径
 * @param moduleName
 */
declare function getFileFullPath(moduleName: string): string;

declare interface IImportOptions {
    /**
     * 当前工作目录
     */
    cwd?: string;
    /**
     * 提供额外的第三方模块查询地址
     */
    nodeModule?: string;
}

/**
 * 导入第三方模块或者ts，js文件
 * @param id
 * @param options
 */
declare function import_<T = any>(id: string, options?: IImportOptions): T;

/**
 * 默认导入优化
 * @param importModule
 */
declare function interopDefault<T = any>(importModule: any): T;

declare interface IReadFileOptions {
    format?: "JSON";
}

declare function isValidJSON(input: string): boolean;

/**
 * 是否是合法的第三方库名称
 * @param input
 */
declare function isValidThirdLibName(input: string): boolean;

declare interface IWriteFileOptions extends IReadFileOptions {
    force?: boolean;
}

declare namespace json {
    export {
        isValidJSON,
        readJSON,
        readJSONSync,
        writeJSON,
        writeJSONSync,
        IReadFileOptions,
        IWriteFileOptions
    }
}
export { json }

declare namespace module_ {
    export {
        interopDefault,
        nativeRequire,
        isValidThirdLibName,
        getFileFullPath,
        transpileFileAndCreateRequire,
        import_,
        IImportOptions
    }
}
export { module_ }

/**
 * 计算时间间隔，并转换单位，可以通过 format 来格式化输出
 *
 * @example
 *
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
 * 原生的 require 方法，导入模块
 * @param id
 * @param requireUrl
 */
declare function nativeRequire<T>(id: string, requireUrl?: string): T;

/**
 *
 * @param file
 * @param cwd
 */
declare function normalize(file: string, cwd?: string): string;

/**
 * Minimal nodejs command arguments parser
 * @param input
 */
export declare const parser: <T extends Record<string, string | boolean | string[]>>(input: string[]) => T;

declare function readJSON<T = unknown>(file: string): Promise<T>;

declare function readJSONSync<T = unknown>(file: string): T;

/**
 * Delete folder
 * @param src
 */
declare function rmdirSync(src: string): void;

declare type TColorsAndStyle = TSupportColor | TSupportStyle | TSupportBgColor;

/**
 *
 * 将代码转换成commonjs，再进行引用
 *
 */
declare function transpileFileAndCreateRequire<T>(file: string, requireUrl: string): T;

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

declare function writeJSON(path: string, json: object, options?: IWriteFileOptions): Promise<void>;

declare function writeJSONSync(path: string, json: object, options?: IWriteFileOptions): void;

export { }
