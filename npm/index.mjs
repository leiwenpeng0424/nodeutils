import nodePath from 'node:path';
import nodeFs from 'node:fs';
import nodeFsPromise from 'node:fs/promises';
import json5 from 'json5';
import { createHash } from 'node:crypto';
import nodeModule from 'node:module';
import { sys, transpile, ScriptTarget, ModuleKind } from 'typescript';
import readline from 'node:readline';

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

var __async$1 = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
function normalize$1(file, cwd = process.cwd()) {
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
    nodeFs.openSync(normalize$1(path), "r");
    return true;
  } catch (e) {
    return false;
  }
}
const writeFile = (path, data) => __async$1(void 0, null, function* () {
  yield nodeFsPromise.writeFile(
    normalize$1(path),
    typeof data === "string" ? data : JSON.stringify(data, null, 4)
  );
});
const writeFileSync = (path, data) => {
  nodeFs.writeFileSync(
    normalize$1(path),
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
  folder = normalize$1(folder);
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
  const fullSrc = normalize$1(src);
  const fullDest = normalize$1(dest);
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
function rmdirSync(src, removeRoot = true) {
  const fullSource = normalize$1(src);
  const dirs = [];
  traverse(fullSource, (file, stats) => {
    if (stats.isFile()) {
      nodeFs.unlinkSync(file);
    } else if (stats.isDirectory()) {
      dirs.push(file);
    }
    return true;
  });
  dirs.reverse().forEach((dir) => nodeFs.rmdirSync(dir));
  if (removeRoot) {
    nodeFs.rmdirSync(src);
  }
}

var file = /*#__PURE__*/Object.freeze({
    __proto__: null,
    buf2str: buf2str,
    checkExist: checkExist,
    copySync: copySync,
    findFile: findFile,
    normalize: normalize$1,
    rmdirSync: rmdirSync,
    traverse: traverse,
    writeFile: writeFile,
    writeFileSync: writeFileSync
});

var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
function isValidJSON(input) {
  try {
    JSON.parse(input);
    return true;
  } catch (e) {
    return false;
  }
}
function readJSON(file) {
  return __async(this, null, function* () {
    console.log("asd");
    return new Promise((resolve) => {
      let buf = "";
      nodeFs.createReadStream(file, {
        flags: "r",
        encoding: "utf-8"
      }).on("data", (d) => {
        buf += d.toString();
      }).on("end", () => {
        resolve(json5.parse(buf));
      });
    });
  });
}
function readJSONSync(file) {
  nodeFs.openSync(file, "r");
  let content = nodeFs.readFileSync(normalize$1(file), {
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
function writeJSON(path, json) {
  return __async(this, null, function* () {
    if (!checkExist(normalize$1(path))) {
      throw Error(`Write destination \`${path}\` is not exist!`);
    }
    try {
      const _json = JSON.stringify(json, null, 4);
      yield writeFile(normalize$1(path), _json);
    } catch (e) {
      console.error(`Error while stringify json`);
    }
  });
}
function writeJSONSync(path, json) {
  if (!checkExist(normalize$1(path))) {
    throw Error(`Write destination \`${path}\` is not exist!`);
  }
  try {
    const _json = JSON.stringify(json, null, 4);
    writeFileSync(normalize$1(path), _json);
  } catch (e) {
    console.error(`Error while stringify json`);
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
  const requireMethod = nodeModule.createRequire(url != null ? url : process.cwd());
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
function normalize(id) {
  if (nodePath.isAbsolute(id)) {
    return id;
  }
  return nodePath.join(process.cwd(), id);
}
function transpileAndRequire(file, requireUrl) {
  var _a, _b;
  const sourceCode = sys.readFile(file);
  const { name: filename } = nodePath.parse(file);
  if (sourceCode) {
    const transpiledCode = transpile(sourceCode, {
      target: ScriptTarget.ES2016,
      module: ModuleKind.CommonJS
    });
    const hash = createHash("sha256").update(transpiledCode, "utf8").digest("hex");
    const dist = process.cwd();
    const tempFile = nodePath.resolve(dist, `${filename}.${hash}.js`);
    sys.writeFile(tempFile, transpiledCode);
    const requredModule = nativeRequire(
      tempFile,
      //
      requireUrl
    );
    (_b = (_a = sys).deleteFile) == null ? void 0 : _b.call(_a, tempFile);
    return requredModule;
  }
}
function import_(id, options = {}) {
  const DefaultOptions = {
    cwd: process.cwd(),
    nodeModule: `node_modules`
  };
  options = Object.assign({}, DefaultOptions, options);
  options.nodeModule = nodePath.resolve(options.cwd, options.nodeModule);
  if (!isValidThirdLibName(id)) {
    id = normalize(id);
    const ext = nodePath.extname(id);
    if ([`.json`].includes(ext)) {
      return nativeRequire(id, options.nodeModule);
    }
    return transpileAndRequire(id, options.nodeModule);
  }
  return nativeRequire(id, options.nodeModule);
}

var m = /*#__PURE__*/Object.freeze({
    __proto__: null,
    import_: import_,
    interopDefault: interopDefault,
    isValidThirdLibName: isValidThirdLibName,
    nativeRequire: nativeRequire,
    normalize: normalize,
    transpileAndRequire: transpileAndRequire
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
function ms(interval, options = { precision: 2 }) {
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

function isArgFlag(input) {
  return /^-{1,2}/.test(input);
}
function stripSlash(input) {
  return input.replace(/^-{1,2}/, "");
}
function parser(input) {
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
}

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
function strSplitByLength(str, len) {
  const result = str.match(new RegExp(`(.{1,${len}})`, "g"));
  return result != null ? result : [];
}
function stripAnsi(text, { onlyFirst } = { onlyFirst: true }) {
  const pattern = [
    "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
    "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))"
  ].join("|");
  return text.replace(
    //
    new RegExp(pattern, onlyFirst ? void 0 : "g"),
    ""
  );
}
class Terminal {
  constructor() {
    __publicField(this, "x");
    __publicField(this, "y");
    __publicField(this, "maxCols");
    __publicField(this, "stdin", process.stdin);
    __publicField(this, "stdout", process.stdout);
    __publicField(this, "rl");
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      historySize: 0,
      removeHistoryDuplicates: true,
      tabSize: 4,
      prompt: "",
      terminal: process.stdout.isTTY
    });
    const pos = this.rl.getCursorPos();
    this.x = pos.cols;
    this.y = pos.rows;
    this.maxCols = process.stdout.columns > 60 ? 60 : process.stdout.columns;
  }
  _write(content) {
    readline.clearScreenDown(this.stdin);
    const segments = strSplitByLength(content, this.maxCols);
    segments.forEach((text) => {
      this.rl.write(text);
      this.y += 1;
    });
    return this;
  }
  nextLine(count = 1) {
    this.y += count;
    this.rl.write("\r");
    return this;
  }
  clearLine(cb) {
    process.stdout.cursorTo(0);
    process.stdout.clearLine(1, () => {
      cb == null ? void 0 : cb();
    });
    return this;
  }
  writeSameLine(content) {
    this.clearLine(() => {
      this._write(content);
    });
    return this;
  }
  writeLine(content) {
    this._write(content);
    return this;
  }
  clearScreen() {
    this.x = 0;
    this.y = 0;
    readline.cursorTo(this.stdin, this.x, this.y);
    readline.clearScreenDown(this.stdin);
    return this;
  }
  box(content) {
    this.writeLine(
      `\u256D${Array(this.maxCols - 2).fill("\u2500").join("")}\u256E`
    );
    this.nextLine();
    const padding = 4;
    const writeCenter = (text) => {
      const originLen = text.length;
      const stripLen = stripAnsi(text).length;
      const len = stripAnsi(text).length - (originLen - stripLen) - 0;
      const restLen = this.maxCols - padding * 2;
      if (restLen < len) {
        strSplitByLength(text, restLen).forEach((t) => {
          writeCenter(t);
        });
      } else {
        const left = Math.ceil((restLen - len) / 2);
        const leftPadding = "\u2502" + Array(left + padding - 1).fill(" ").join("");
        const rightPadding = Array(restLen - left - len + padding - 1).fill(" ").join("") + "\u2502";
        this.writeLine(`${leftPadding}${text}${rightPadding}`);
        this.nextLine();
      }
    };
    const contents = [
      " ",
      typeof content === "string" ? content : content,
      " "
    ].flat();
    contents.forEach((t) => {
      writeCenter(t);
    });
    this.writeLine(
      `\u2570${Array(this.maxCols - 2).fill("\u2500").join("")}\u256F`
    );
    this.nextLine();
    return this;
  }
}

export { Terminal, colors, file, json, m, ms, parser };
//# sourceMappingURL=index.mjs.map
