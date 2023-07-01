const precision = 2;
const Units = ["ms", "s", "m", "h", "d"];

/**
 * 毫秒转秒
 * @param ms
 */
export function toS(ms: number): string {
    return (ms / 1000).toFixed(precision);
}

/**
 * 毫秒转分钟
 * @param ms
 */
export function toM(ms: number): string {
    return (ms / 1000 / 60).toFixed(precision);
}

/**
 * 毫秒转小时
 * @param ms
 */
export function toH(ms: number): string {
    return (ms / 1000 / 60 / 60).toFixed(precision);
}

/**
 * 毫秒转天数
 * @param ms
 */
export function toD(ms: number): string {
    return (ms / 1000 / 60 / 60 / 24).toFixed(precision);
}

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
export default function ms(interval: number): string {
    // TODO: 添加对format的支持
    /** hh:mm:ss */
    let duration: string;

    if (interval < 1000) {
        duration = `${interval}${Units[0]}`;
    } else if (interval % (60 * 1000) === interval && interval < 60 * 1000) {
        duration = toS(interval) + Units[1];
    } else if (
        interval % (1000 * 60 * 60) === interval &&
        interval < 1000 * 60 * 60
    ) {
        duration = toM(interval) + Units[2];
    } else if (
        interval % (1000 * 60 * 60 * 24) === interval &&
        interval < 1000 * 60 * 60 * 24
    ) {
        duration = toH(interval) + Units[3];
    } else {
        duration = toD(interval) + Units[4];
    }

    return duration;
}
