import colors from "./colors";

export type MeasureResult = {
    duration: number;
};

export function measureSync(mark: string, task: () => void) {
    performance.mark(`${mark} start`);
    task();
    performance.mark(`${mark} end`);

    return performance.measure(
        `${mark} start to end`,
        `${mark} start`,
        `${mark} end`
    );
}

export async function measure(mark: string, task: () => Promise<void>) {
    performance.mark(`${mark} start`);
    await task();
    performance.mark(`${mark} end`);

    return performance.measure(
        `${mark} start to end`,
        `${mark} start`,
        `${mark} end`
    );
}
