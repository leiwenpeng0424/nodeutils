export declare const colors: Record<TColorsAndStyle, (text: string) => string>;

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

/**
 * 是否是合法的第三方库名称
 * @param input
 */
declare function isValidThirdLibName(input: string): boolean;

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
 * Minimal nodejs command arguments parser
 * @param input
 */
export declare const parser: <T extends Record<string, string | boolean | string[]>>(input: string[]) => T;

declare type TColorsAndStyle = TSupportColor | TSupportStyle | TSupportBgColor;

/**
 *
 * 将代码转换成commonjs，再进行引用
 *
 */
declare function transpileFileAndCreateRequire<T>(file: string, requireUrl: string): T;

declare type TSupportBgColor = "bgBlack" | "bgRed" | "bgGreen" | "bgYellow" | "bgBlue" | "bgMagenta" | "bgCyan" | "bgWhite";

declare type TSupportColor = "black" | "red" | "green" | "yellow" | "cyan" | "blue" | "magenta" | "white" | "gray" | "brightRed" | "brightGreen" | "brightYellow" | "brightBlue" | "brightMagenta" | "brightCyan" | "brightWhite";

declare type TSupportStyle = "bold" | "underline" | "reversed";

export { }
