type TSupportColor = "black" | "red" | "green" | "yellow" | "cyan";
type TSupportStyle = "bold";
type TSupportBgColor = "bgBlack" | "bgRed" | "bgGreen" | "bgYellow";

type TColorsAndStyle = TSupportColor | TSupportStyle | TSupportBgColor;

const styles: Record<TColorsAndStyle, [string, string]> = {
    // 文字样式
    bold: ["\u001b[1m", "\u001b[22m"],
    // 文字颜色
    black: ["\u001b[30m", "\u001b[39m"],
    red: ["\u001b[31m", "\u001b[39m"],
    green: ["\u001b[32m", "\u001b[39m"],
    yellow: ["\u001b[33m", "\u001b[39m"],
    cyan: ["\u001b[36m", "\u001b[39m"],
    // 背景色
    bgBlack: ["\u001b[40m", "\u001b[49m"],
    bgRed: ["\u001b[41m", "\u001b[49m"],
    bgGreen: ["\u001b[42m", "\u001b[49m"],
    bgYellow: ["\u001b[43m", "\u001b[49m"],
};

const colors = (Object.keys(styles) as TColorsAndStyle[]).reduce(
    (colors, key) => {
        colors[key] = (text: string) => styles[key][0] + text + styles[key][1];
        return colors;
    },
    {} as Record<TColorsAndStyle, (text: string) => string>
);

export default colors;
