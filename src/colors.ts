type TSupportColor =
    | "black"
    | "red"
    | "green"
    | "yellow"
    | "cyan"
    | "blue"
    | "magenta"
    | "white"
    | "gray"
    | "brightRed"
    | "brightGreen"
    | "brightYellow"
    | "brightBlue"
    | "brightMagenta"
    | "brightCyan"
    | "brightWhite";

type TSupportStyle = "bold" | "underline" | "reversed";

type TSupportBgColor =
    | "bgBlack"
    | "bgRed"
    | "bgGreen"
    | "bgYellow"
    | "bgBlue"
    | "bgMagenta"
    | "bgCyan"
    | "bgWhite";

type TColorsAndStyle = TSupportColor | TSupportStyle | TSupportBgColor;

const styles: Record<TColorsAndStyle, [string, string]> = {
    // Text Style
    bold: ["\u001b[1m", "\u001b[22m"],
    underline: ["\u001b[4m", "\u001b[22m"],
    reversed: ["\u001b[7m", "\u001b[22m"],

    // Text Colors
    black: ["\u001b[30m", "\u001b[39m"],
    red: ["\u001b[31m", "\u001b[39m"],
    green: ["\u001b[32m", "\u001b[39m"],
    yellow: ["\u001b[33m", "\u001b[39m"],
    blue: ["\u001b[34m", "\u001b[39m"],
    magenta: ["\u001b[35m", "\u001b[39m"],
    cyan: ["\u001b[36m", "\u001b[39m"],
    white: ["\u001b[37m", "\u001b[39m"],
    gray: ["\u001b[90m", "\u001b[39m"],
    brightRed: ["\u001b[91m", "\u001b[39m"],
    brightGreen: ["\u001b[91m", "\u001b[39m"],
    brightYellow: ["\u001b[91m", "\u001b[39m"],
    brightBlue: ["\u001b[91m", "\u001b[39m"],
    brightMagenta: ["\u001b[91m", "\u001b[39m"],
    brightCyan: ["\u001b[91m", "\u001b[39m"],
    brightWhite: ["\u001b[91m", "\u001b[39m"],

    // BG Colors
    bgBlack: ["\u001b[40m", "\u001b[49m"],
    bgRed: ["\u001b[41m", "\u001b[49m"],
    bgGreen: ["\u001b[42m", "\u001b[49m"],
    bgYellow: ["\u001b[43m", "\u001b[49m"],
    bgBlue: ["\u001b[44m", "\u001b[49m"],
    bgMagenta: ["\u001b[45m", "\u001b[49m"],
    bgCyan: ["\u001b[46m", "\u001b[49m"],
    bgWhite: ["\u001b[47m", "\u001b[49m"],
};

export default (Object.keys(styles) as TColorsAndStyle[]).reduce(
    (colors, key) => {
        colors[key] = (text: string) => styles[key][0] + text + styles[key][1];
        return colors;
    },
    {} as Record<TColorsAndStyle, (text: string) => string>
);
