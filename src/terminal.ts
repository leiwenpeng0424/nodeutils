import readline from "node:readline";

/**
 * Split text by length.
 * @param str
 * @param len
 */
export function strSplitByLength(str: string, len: number): string[] {
    const result = str.match(new RegExp(`(.{1,${len}})`, "g"));
    return result ?? [];
}

/** @link https://github.com/chalk/strip-ansi/blob/main/index.js */
export function stripAnsi(
    text: string,
    { onlyFirst }: { onlyFirst: boolean } = { onlyFirst: true }
) {
    const pattern = [
        "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
        "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))",
    ].join("|");
    return text.replace(
        //
        new RegExp(pattern, onlyFirst ? undefined : "g"),
        ""
    );
}

export default class Terminal {
    private x: number;
    private y: number;

    private maxCols: number;

    private readonly stdin = process.stdin;
    private readonly stdout = process.stdout;

    private readonly rl: readline.Interface;

    constructor() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            historySize: 0,
            removeHistoryDuplicates: true,
            tabSize: 4,
            prompt: "",
            terminal: process.stdout.isTTY,
        });

        const pos = this.rl.getCursorPos();
        this.x = pos.cols;
        this.y = pos.rows;
        this.maxCols =
            process.stdout.columns > 60 ? 60 : process.stdout.columns;
    }

    private _write(content: string) {
        readline.clearScreenDown(this.stdin);
        const segments = strSplitByLength(content, this.maxCols);
        segments.forEach((text) => {
            this.rl.write(text);
            this.y += 1;
        });

        return this;
    }

    public nextLine(count = 1) {
        this.y += count;
        this.rl.write("\r");
        return this;
    }

    public clearLine(cb?: () => void) {
        process.stdout.cursorTo(0);
        process.stdout.clearLine(1, () => {
            cb?.();
        });
        return this;
    }

    public writeSameLine(content: string) {
        this.clearLine(() => {
            this._write(content);
        });
        return this;
    }

    public writeLine(content: string) {
        this._write(content);
        return this;
    }

    public clearScreen() {
        this.x = 0;
        this.y = 0;
        readline.cursorTo(this.stdin, this.x, this.y);
        readline.clearScreenDown(this.stdin);
        return this;
    }

    public box(content: string | string[]) {
        this.writeLine(
            `╭${Array(this.maxCols - 2)
                .fill("─")
                .join("")}╮`
        );
        this.nextLine();
        const padding = 4;
        const writeCenter = (text: string) => {
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
                const leftPadding =
                    "│" +
                    Array(left + padding - 1)
                        .fill(" ")
                        .join("");
                const rightPadding =
                    Array(restLen - left - len + padding - 1)
                        .fill(" ")
                        .join("") + "│";

                this.writeLine(`${leftPadding}${text}${rightPadding}`);
                this.nextLine();
            }
        };
        const contents = [
            " ",
            typeof content === "string" ? content : content,
            " ",
        ].flat();
        contents.forEach((t) => {
            writeCenter(t);
        });
        this.writeLine(
            `╰${Array(this.maxCols - 2)
                .fill("─")
                .join("")}╯`
        );
        this.nextLine();
        return this;
    }
}
