/**
 * Start with -/--
 * @param input
 */
const isArgFlag = (input: string): boolean => /^-{1,2}/.test(input);

/**
 * Strip slash -/--
 * @param input
 */
const stripSlash = (input: string): string => input.replace(/^-{1,2}/, "");

/**
 * Minimal nodejs command arguments parser
 * @param input
 */
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
                    Object.assign(accumulator, { [stripSlash(arg)]: true });
                } else {
                    if (!isArgFlag(next)) {
                        Object.assign(accumulator, { [stripSlash(arg)]: next });
                    } else {
                        Object.assign(accumulator, { [stripSlash(arg)]: true });
                    }
                }
            }
            return accumulator;
        }, {} as T);
};

export default parser;
