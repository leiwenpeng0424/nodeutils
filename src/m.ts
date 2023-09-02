import { createHash } from "node:crypto";
import nodeModule from "node:module";
import nodePath from "node:path";
import { ModuleKind, ScriptTarget, sys, transpile } from "typescript";

interface IImportOptions {
    cwd?: string;
    nodeModule?: string;
}

/**
 * @param importModule
 */
// eslint-disable-next-line
export function interopDefault<T = unknown>(importModule: any): T {
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
 * @param url
 */
function getNativeRequire(url?: string): (id: string) => unknown {
    const requireMethod = nodeModule.createRequire(url ?? process.cwd());

    return (id: string) => {
        return requireMethod(id);
    };
}

/**
 * @param id
 * @param requireUrl
 */
// eslint-disable-next-line
export function nativeRequire<T = any>(id: string, requireUrl?: string): T {
    return interopDefault(getNativeRequire(requireUrl)(id)) as T;
}

/**
 * @param input
 */
export function isValidThirdLibName(input: string): boolean {
    return /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(
        input
    );
}

/**
 * @param id
 */
export function normalize(id: string) {
    if (nodePath.isAbsolute(id)) {
        return id;
    }
    return nodePath.join(process.cwd(), id);
}

/**
 * Compile file, and create node require.
 **/
export function transpileAndRequire<T>(file: string, requireUrl: string) {
    const sourceCode = sys.readFile(file);
    const { name: filename } = nodePath.parse(file);

    if (sourceCode) {
        const transpiledCode = transpile(sourceCode, {
            target: ScriptTarget.ES2016,
            module: ModuleKind.CommonJS,
        });

        const hash = createHash("sha256")
            .update(transpiledCode, "utf8")
            .digest("hex");

        const dist = process.cwd();

        const tempFile = nodePath.resolve(dist, `${filename}.${hash}.js`);

        sys.writeFile(tempFile, transpiledCode);

        const requredModule = nativeRequire<T>(
            tempFile, //
            requireUrl
        );

        sys.deleteFile?.(tempFile);

        return requredModule;
    }
}

/**
 * @param id
 * @param options
 */
export function import_<T = unknown>(
    id: string,
    options: IImportOptions = {}
): T {
    const DefaultOptions: IImportOptions = {
        cwd: process.cwd(),
        nodeModule: `node_modules`,
    };

    options = Object.assign({}, DefaultOptions, options);

    // eslint-disable-next-line
    options.nodeModule = nodePath.resolve(options.cwd!, options.nodeModule!);

    if (!isValidThirdLibName(id)) {
        id = normalize(id);
        const ext = nodePath.extname(id);

        // Using native require.
        if ([`.json`].includes(ext)) {
            return nativeRequire<T>(id, options.nodeModule);
        }

        return transpileAndRequire<T>(id, options.nodeModule) as T;
    }

    return nativeRequire<T>(id, options.nodeModule);
}
