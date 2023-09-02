/**
 * Units
 **/
const Units = ["ms", "s", "m", "h", "d"];

/**
 * @param ms
 * @param precision
 */
export function toS(ms: number, precision = 2): string {
    return (ms / 1000).toFixed(precision);
}

/**
 * @param ms
 * @param precision
 */
export function toM(ms: number, precision = 2): string {
    return (ms / 1000 / 60).toFixed(precision);
}

/**
 * @param ms
 * @param precision
 */
export function toH(ms: number, precision = 2): string {
    return (ms / 1000 / 60 / 60).toFixed(precision);
}

/**
 * @param ms
 * @param precision
 */
export function toD(ms: number, precision = 2): string {
    return (ms / 1000 / 60 / 60 / 24).toFixed(precision);
}

/**
 * 计算时间间隔，并转换单位，可以通过 format 来格式化输出
 *
 * @example
 *  input     | output
 *  12        | 12ms
 *  120000    | 2m
 *  1200000   | 20m
 *  12000000  | 3.33h
 *  120000000 | 1.39d
 *
 * @param interval
 * @param options
 */
export default function ms(
    interval: number,
    options: {
        precision?: number;
    } = { precision: 2 }
): string {
    let duration: string;

    if (interval < 1000) {
        duration = `${interval}${Units[0]}`;
    } else if (interval % (60 * 1000) === interval && interval < 60 * 1000) {
        duration = toS(interval, options?.precision) + Units[1];
    } else if (
        interval % (1000 * 60 * 60) === interval &&
        interval < 1000 * 60 * 60
    ) {
        duration = toM(interval, options?.precision) + Units[2];
    } else if (
        interval % (1000 * 60 * 60 * 24) === interval &&
        interval < 1000 * 60 * 60 * 24
    ) {
        duration = toH(interval, options?.precision) + Units[3];
    } else {
        duration = toD(interval, options?.precision) + Units[4];
    }

    return duration;
}
