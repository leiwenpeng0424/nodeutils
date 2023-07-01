declare const parser: <T extends object = Record<string, string | boolean>>(input: string[]) => T;
export default parser;
