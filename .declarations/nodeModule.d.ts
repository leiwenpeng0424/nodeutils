export interface IImportOptions {
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
 * 默认导入优化
 * @param importModule
 */
export declare function interopDefault<T = any>(importModule: any): T;
/**
 * 原生的 require 方法，导入模块
 * @param id
 * @param requireUrl
 */
export declare function nativeRequire<T>(id: string, requireUrl?: string): T;
/**
 * 是否是合法的第三方库名称
 * @param input
 */
export declare function isValidThirdLibName(input: string): boolean;
/**
 * 获取完整的路径
 * @param moduleName
 */
export declare function getFileFullPath(moduleName: string): string;
/**
 *
 * 将代码转换成commonjs，再进行引用
 *
 */
export declare function transpileFileAndCreateRequire<T>(file: string, requireUrl: string): T;
/**
 * 导入第三方模块或者ts，js文件
 * @param id
 * @param options
 */
export declare function import_<T = any>(id: string, options?: IImportOptions): T;
