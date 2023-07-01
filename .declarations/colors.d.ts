type TSupportColor = "black" | "red" | "green" | "yellow" | "cyan";
type TSupportStyle = "bold";
type TSupportBgColor = "bgBlack" | "bgRed" | "bgGreen" | "bgYellow";
type TColorsAndStyle = TSupportColor | TSupportStyle | TSupportBgColor;
declare const colors: Record<TColorsAndStyle, (text: string) => string>;
export default colors;
