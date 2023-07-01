// String start with '--' or '-'.
const isArgFlag = (input: string): boolean => /^-{1,2}/.test(input);

// Remove prefix '--' or '-'.
const strip = (input: string): string => input.replace(/^-{1,2}/, "");

// Simple cmd input parser.
const parser = <T extends object = Record<string, string | boolean>>(
    input: string[]
): T => {
    const lastNonArgFlagIndex = input.findIndex((curr) => isArgFlag(curr));
    const _ = input.slice(
        0,
        lastNonArgFlagIndex === -1 ? 1 : lastNonArgFlagIndex
    );
    return input
        .slice(_.length)
        .reduce((accumulator, arg, currentIndex, arr) => {
            const next = arr[currentIndex + 1];
            if (isArgFlag(arg)) {
                if (!next) {
                    Object.assign(accumulator, { [strip(arg)]: true });
                } else {
                    if (!isArgFlag(next)) {
                        Object.assign(accumulator, { [strip(arg)]: next });
                    } else {
                        Object.assign(accumulator, { [strip(arg)]: true });
                    }
                }
            }
            return accumulator;
        }, {} as T);
};

export default parser;
