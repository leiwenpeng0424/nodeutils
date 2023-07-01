type TSupportColor = "black" | "red" | "green" | "yellow" | "cyan";
type TSupportStyle = "bold";
type TSupportBgColor = "bgBlack" | "bgRed" | "bgGreen" | "bgYellow";
type TColorsAndStyle = TSupportColor | TSupportStyle | TSupportBgColor;
declare const _default: Record<TColorsAndStyle, (text: string) => string>;
export default _default;
