import { createHash } from 'node:crypto';
import nodeFs from 'node:fs';
import nodeModule from 'node:module';
import nodePath from 'node:path';
import * as process$1 from 'process';
import { transpile, ScriptTarget, ModuleKind } from 'typescript';
import nodeFsPromise from 'node:fs/promises';
import json5 from 'json5';

const isArgFlag = (input) => /^-{1,2}/.test(input);
function stripSlash(input) {
  return input.replace(/^-{1,2}/, "");
}
const parser = (input) => {
  let newInput = [];
  for (const str of input) {
    newInput = newInput.concat(str.split("=").filter(Boolean));
  }
  const lastNonArgFlagIndex = newInput.findIndex((curr) => isArgFlag(curr));
  const _ = newInput.slice(
    0,
    lastNonArgFlagIndex === -1 ? 1 : lastNonArgFlagIndex
  );
  return newInput.slice(_.length).reduce((accumulator, arg, currentIndex, arr) => {
    const next = arr[currentIndex + 1];
    if (isArgFlag(arg)) {
      if (!next) {
        Object.assign(accumulator, { [stripSlash(arg)]: true });
      } else {
        if (!isArgFlag(next)) {
          const key = stripSlash(arg);
          let value = accumulator[key];
          if (value) {
            if (Array.isArray(value)) {
              value = [...value, next];
            } else {
              value = [value, next];
            }
            Object.assign(accumulator, {
              [stripSlash(arg)]: value
            });
          } else {
            Object.assign(accumulator, {
              [stripSlash(arg)]: next
            });
          }
        } else {
          Object.assign(accumulator, { [stripSlash(arg)]: true });
        }
      }
    }
    return accumulator;
  }, {});
};

const styles = {
  // Text Style
  bold: ["\x1B[1m", "\x1B[22m"],
  underline: ["\x1B[4m", "\x1B[22m"],
  reversed: ["\x1B[7m", "\x1B[22m"],
  // Text Colors
  black: ["\x1B[30m", "\x1B[39m"],
  red: ["\x1B[31m", "\x1B[39m"],
  green: ["\x1B[32m", "\x1B[39m"],
  yellow: ["\x1B[33m", "\x1B[39m"],
  blue: ["\x1B[34m", "\x1B[39m"],
  magenta: ["\x1B[35m", "\x1B[39m"],
  cyan: ["\x1B[36m", "\x1B[39m"],
  white: ["\x1B[37m", "\x1B[39m"],
  gray: ["\x1B[90m", "\x1B[39m"],
  brightRed: ["\x1B[91m", "\x1B[39m"],
  brightGreen: ["\x1B[92m", "\x1B[39m"],
  brightYellow: ["\x1B[93m", "\x1B[39m"],
  brightBlue: ["\x1B[94m", "\x1B[39m"],
  brightMagenta: ["\x1B[95m", "\x1B[39m"],
  brightCyan: ["\x1B[96m", "\x1B[39m"],
  brightWhite: ["\x1B[97m", "\x1B[39m"],
  // BG Colors
  bgBlack: ["\x1B[40m", "\x1B[49m"],
  bgRed: ["\x1B[41m", "\x1B[49m"],
  bgGreen: ["\x1B[42m", "\x1B[49m"],
  bgYellow: ["\x1B[43m", "\x1B[49m"],
  bgBlue: ["\x1B[44m", "\x1B[49m"],
  bgMagenta: ["\x1B[45m", "\x1B[49m"],
  bgCyan: ["\x1B[46m", "\x1B[49m"],
  bgWhite: ["\x1B[47m", "\x1B[49m"]
};
var colors = Object.keys(styles).reduce(
  (colors, key) => {
    colors[key] = (text) => styles[key][0] + text + styles[key][1];
    return colors;
  },
  {}
);

function interopDefault(importModule) {
  if (!("default" in importModule) || !(typeof importModule === "object" && importModule != null)) {
    return importModule;
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
          }
        });
      }
    } catch (e) {
      throw e;
    }
  }
  return newMod;
}
function getNativeRequire(url) {
  const requireMethod = nodeModule.createRequire(url != null ? url : process$1.cwd());
  return (id) => {
    return requireMethod(id);
  };
}
function nativeRequire(id, requireUrl) {
  return interopDefault(getNativeRequire(requireUrl)(id));
}
function isValidThirdLibName(input) {
  return /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(
    input
  );
}
function getFileFullPath(moduleName) {
  if (nodePath.isAbsolute(moduleName)) {
    return moduleName;
  }
  return nodePath.join(process$1.cwd(), moduleName);
}
function transpileFileAndCreateRequire(file, requireUrl) {
  const sourceCode = nodeFs.readFileSync(file);
  const transpiledSourceCode = transpile(sourceCode.toString("utf-8"), {
    target: ScriptTarget.ESNext,
    module: ModuleKind.CommonJS
  });
  const hash = createHash("sha256").update(transpiledSourceCode, "utf8").digest("hex");
  const cacheFolder = nodePath.join(process$1.cwd(), `node_modules/.cache`);
  try {
    nodeFs.accessSync(cacheFolder);
  } catch (e) {
    nodeFs.mkdirSync(cacheFolder);
  }
  const transpiledSourceFile = nodePath.resolve(cacheFolder, `${hash}.js`);
  nodeFs.writeFileSync(
    transpiledSourceFile,
    //
    transpiledSourceCode
  );
  return nativeRequire(
    transpiledSourceFile,
    //
    requireUrl
  );
}
function import_(id, options = {}) {
  const DefaultOptions = {
    cwd: process$1.cwd(),
    nodeModule: `node_modules`
  };
  options = Object.assign({}, DefaultOptions, options);
  options.nodeModule = nodePath.resolve(options.cwd, options.nodeModule);
  if (!isValidThirdLibName(id)) {
    id = getFileFullPath(id);
    const ext = nodePath.extname(id);
    if ([`.json`, `.cjs`].includes(ext)) {
      return nativeRequire(id, options.nodeModule);
    }
    if ([".js", ".ts", ".mts", ".cts", ".mjs"].includes(ext)) {
      return transpileFileAndCreateRequire(id, options.nodeModule);
    }
  }
  return nativeRequire(id, options.nodeModule);
}

var module_ = /*#__PURE__*/Object.freeze({
    __proto__: null,
    getFileFullPath: getFileFullPath,
    import_: import_,
    interopDefault: interopDefault,
    isValidThirdLibName: isValidThirdLibName,
    nativeRequire: nativeRequire,
    transpileFileAndCreateRequire: transpileFileAndCreateRequire
});

const Units = ["ms", "s", "m", "h", "d"];
function toS(ms2, precision = 2) {
  return (ms2 / 1e3).toFixed(precision);
}
function toM(ms2, precision = 2) {
  return (ms2 / 1e3 / 60).toFixed(precision);
}
function toH(ms2, precision = 2) {
  return (ms2 / 1e3 / 60 / 60).toFixed(precision);
}
function toD(ms2, precision = 2) {
  return (ms2 / 1e3 / 60 / 60 / 24).toFixed(precision);
}
function ms(interval, options) {
  let duration;
  if (interval < 1e3) {
    duration = `${interval}${Units[0]}`;
  } else if (interval % (60 * 1e3) === interval && interval < 60 * 1e3) {
    duration = toS(interval, options == null ? void 0 : options.precision) + Units[1];
  } else if (interval % (1e3 * 60 * 60) === interval && interval < 1e3 * 60 * 60) {
    duration = toM(interval, options == null ? void 0 : options.precision) + Units[2];
  } else if (interval % (1e3 * 60 * 60 * 24) === interval && interval < 1e3 * 60 * 60 * 24) {
    duration = toH(interval, options == null ? void 0 : options.precision) + Units[3];
  } else {
    duration = toD(interval, options == null ? void 0 : options.precision) + Units[4];
  }
  return duration;
}

function normalize(file, cwd = process.cwd()) {
  if (nodePath.isAbsolute(file)) {
    return file;
  }
  return nodePath.join(cwd, file);
}
function buf2str(buf) {
  return buf.toString(`utf-8`);
}
function checkExist(path) {
  try {
    nodeFs.openSync(normalize(path), "r");
    return true;
  } catch (e) {
    return false;
  }
}
const writeFile = async (path, data) => {
  await nodeFsPromise.writeFile(
    normalize(path),
    typeof data === "string" ? data : JSON.stringify(data, null, 4)
  );
};
const writeFileSync = (path, data) => {
  nodeFs.writeFileSync(
    normalize(path),
    typeof data === "string" ? data : JSON.stringify(data, null, 4)
  );
};
function traverse(dir, visitor) {
  const stats = nodeFs.statSync(dir);
  if (stats.isDirectory() && visitor(dir, stats)) {
    for (const subDirName of nodeFs.readdirSync(dir)) {
      traverse(nodePath.resolve(dir, subDirName), visitor);
    }
  } else if (stats.isFile()) {
    visitor(dir, stats);
  }
}
function findFile(file, folder, ignore = /(node_modules|\.git|\.idea)/) {
  const fileNameReg = new RegExp(`/${file}$`, `gm`);
  folder = normalize(folder);
  let tFile;
  traverse(
    folder,
    //
    (file2) => {
      if (fileNameReg.test(file2)) {
        tFile = file2;
        return false;
      }
      return !ignore.test(file2);
    }
  );
  return tFile;
}
function copySync(src, dest) {
  const fullSrc = normalize(src);
  const fullDest = normalize(dest);
  traverse(fullSrc, (file, stats) => {
    const relativePath = nodePath.relative(fullSrc, file);
    const newPath = nodePath.resolve(fullDest, relativePath);
    if (stats.isFile()) {
      nodeFs.writeFileSync(newPath, nodeFs.readFileSync(file));
    } else if (stats.isDirectory() && !nodeFs.existsSync(newPath)) {
      nodeFs.mkdirSync(newPath);
    } else if (stats.isSymbolicLink()) ;
    return true;
  });
}
function rmdirSync(src) {
  const fullSrc = normalize(src);
  const dirs = [];
  traverse(fullSrc, (file, stats) => {
    if (stats.isFile()) {
      nodeFs.unlinkSync(file);
    } else if (stats.isDirectory()) {
      dirs.push(file);
    }
    return true;
  });
  dirs.reverse().forEach((dir) => nodeFs.rmdirSync(dir));
}

var file = /*#__PURE__*/Object.freeze({
    __proto__: null,
    buf2str: buf2str,
    checkExist: checkExist,
    copySync: copySync,
    findFile: findFile,
    normalize: normalize,
    rmdirSync: rmdirSync,
    traverse: traverse,
    writeFile: writeFile,
    writeFileSync: writeFileSync
});

function isValidJSON(input) {
  try {
    JSON.parse(input);
    return true;
  } catch (e) {
    return false;
  }
}
async function readJSON(file) {
  await nodeFsPromise.open(file);
  let content = await nodeFsPromise.readFile(normalize(file), {
    encoding: "utf-8"
  });
  if (Buffer.isBuffer(content)) {
    content = buf2str(content);
  }
  try {
    return json5.parse(content);
  } catch (e) {
    throw new Error(
      `json5.parse() error, while processing content from ${file}`
    );
  }
}
function readJSONSync(file) {
  nodeFs.openSync(file, "r");
  let content = nodeFs.readFileSync(normalize(file), {
    encoding: "utf-8"
  });
  if (Buffer.isBuffer(content)) {
    content = buf2str(content);
  }
  try {
    return json5.parse(content);
  } catch (e) {
    throw new Error(
      `json5.parse() error, while processing content from ${file}`
    );
  }
}
async function writeJSON(path, json, options) {
  if (checkExist(normalize(path)) || (options == null ? void 0 : options.force)) {
    await writeFile(normalize(path), JSON.stringify(json, null, 4));
  } else {
    throw Error(`File path "${path}" is not exist!`);
  }
}
function writeJSONSync(path, json, options) {
  if (checkExist(normalize(path)) || (options == null ? void 0 : options.force)) {
    writeFileSync(normalize(path), JSON.stringify(json, null, 4));
  } else {
    throw Error(`File path "${path}" is not exist!`);
  }
}

var json = /*#__PURE__*/Object.freeze({
    __proto__: null,
    isValidJSON: isValidJSON,
    readJSON: readJSON,
    readJSONSync: readJSONSync,
    writeJSON: writeJSON,
    writeJSONSync: writeJSONSync
});

export { colors, file, json, module_, ms, parser };
//# sourceMappingURL=index.esm.js.map
