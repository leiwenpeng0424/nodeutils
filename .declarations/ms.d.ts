/**
 * 毫秒转秒
 * @param ms
 */
export declare function toS(ms: number): string;
/**
 * 毫秒转分钟
 * @param ms
 */
export declare function toM(ms: number): string;
/**
 * 毫秒转小时
 * @param ms
 */
export declare function toH(ms: number): string;
/**
 * 毫秒转天数
 * @param ms
 */
export declare function toD(ms: number): string;
/**
 * 计算时间间隔，并转换单位，可以通过 format 来格式化输出
 *
 * @example
 *
 *  input     | output
 *  12        | 12ms
 *  120000    | 2m
 *  1200000   | 20m
 *  12000000  | 3.33h
 *  120000000 | 1.39d
 *
 * @param interval
 */
export default function ms(interval: number, format?: string): string;
