import { createHash } from "node:crypto";
import nodeFs from "node:fs";
import nodeModule from "node:module";
import nodePath from "node:path";
import * as process from "process";
import { ModuleKind, ScriptTarget, transpile } from "typescript";

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
export function interopDefault<T = any>(importModule: any): T {
    if (
        !("default" in importModule) ||
        !(typeof importModule === "object" && importModule != null)
    ) {
        return importModule as T;
    }

    const newMod = importModule.default;

    for (const key in importModule) {
        const isDefault = key === "default";
        try {
            if (!(key in newMod)) {
                Object.defineProperty(newMod, key, {
                    enumerable: !isDefault,
                    configurable: !isDefault,
                    get() {
                        return isDefault ? newMod : importModule[key];
                    },
                });
            }
        } catch (e: unknown) {
            throw e;
        }
    }

    return newMod as T;
}

/**
 * 获取默认的require方法
 * @param url
 */
function getNativeRequire(url?: string): (id: string) => unknown {
    const requireMethod = nodeModule.createRequire(url ?? process.cwd());

    return (id: string) => {
        return requireMethod(id);
    };
}

/**
 * 原生的 require 方法，导入模块
 * @param id
 * @param requireUrl
 */
export function nativeRequire<T>(id: string, requireUrl?: string): T {
    return interopDefault(getNativeRequire(requireUrl)(id)) as T;
}

/**
 * 是否是合法的第三方库名称
 * @param input
 */
export function isValidThirdLibName(input: string): boolean {
    return /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(
        input
    );
}

/**
 * 获取完整的路径
 * @param moduleName
 */
export function getFileFullPath(moduleName: string) {
    if (nodePath.isAbsolute(moduleName)) {
        return moduleName;
    }
    return nodePath.join(process.cwd(), moduleName);
}

/**
 *
 * 将代码转换成commonjs，再进行引用
 *
 */
export function transpileFileAndCreateRequire<T>(
    file: string,
    requireUrl: string
) {
    const sourceCode = nodeFs.readFileSync(file);

    const transpiledSourceCode = transpile(sourceCode.toString("utf-8"), {
        target: ScriptTarget.ESNext,
        module: ModuleKind.CommonJS,
    });

    const hash = createHash("sha256")
        .update(transpiledSourceCode, "utf8")
        .digest("hex");

    const cacheFolder = nodePath.join(process.cwd(), `node_modules/.cache`);

    try {
        nodeFs.accessSync(cacheFolder);
    } catch (e) {
        nodeFs.mkdirSync(cacheFolder);
    }

    const transpiledSourceFile = nodePath.resolve(cacheFolder, `${hash}.js`);

    nodeFs.writeFileSync(
        transpiledSourceFile, //
        transpiledSourceCode
    );

    return nativeRequire<T>(
        transpiledSourceFile, //
        requireUrl
    );
}

/**
 * 导入第三方模块或者ts，js文件
 * @param id
 * @param options
 */
export function import_<T = any>(id: string, options: IImportOptions = {}): T {
    const DefaultOptions: IImportOptions = {
        cwd: process.cwd(),
        nodeModule: `node_modules`,
    };

    options = Object.assign({}, DefaultOptions, options);
    options.nodeModule = nodePath.resolve(options.cwd!, options.nodeModule!);

    if (!isValidThirdLibName(id)) {
        id = getFileFullPath(id);
        const ext = nodePath.extname(id);
        // TODO: 处理 esm js 文件
        if ([`.json`, `.cjs`].includes(ext)) {
            return nativeRequire<T>(id, options.nodeModule);
        }

        if ([".js", ".ts", ".mts", ".cts", ".mjs"].includes(ext)) {
            return transpileFileAndCreateRequire<T>(id, options.nodeModule);
        }
    }

    return nativeRequire<T>(id, options.nodeModule);
}
