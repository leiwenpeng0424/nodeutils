/**
 * Start with -/--
 * @param input
 */
const isArgFlag = (input: string): boolean => /^-{1,2}/.test(input);

/**
 * Strip slash -/--
 * @param input
 */
function stripSlash(input: string): string {
    return input.replace(/^-{1,2}/, "");
}

/**
 * Minimal nodejs command arguments parser
 * @param input
 */
const parser = <T extends Record<string, string | boolean | string[]>>(
    input: string[]
): T => {
    let newInput: string[] = [];

    for (const str of input) {
        newInput = newInput.concat(str.split("=").filter(Boolean));
    }

    const lastNonArgFlagIndex = newInput.findIndex((curr) => isArgFlag(curr));
    const _ = newInput.slice(
        0,
        lastNonArgFlagIndex === -1 ? 1 : lastNonArgFlagIndex
    );

    return newInput
        .slice(_.length)
        .reduce((accumulator, arg, currentIndex, arr) => {
            const next = arr[currentIndex + 1];
            if (isArgFlag(arg)) {
                if (!next) {
                    Object.assign(accumulator, { [stripSlash(arg)]: true });
                } else {
                    if (!isArgFlag(next)) {
                        const key = stripSlash(arg);
                        let value = accumulator[key];
                        if (value) {
                            if (Array.isArray(value)) {
                                value = [...value, next];
                            } else {
                                value = [value as string, next];
                            }
                            Object.assign(accumulator, {
                                [stripSlash(arg)]: value,
                            });
                        } else {
                            Object.assign(accumulator, {
                                [stripSlash(arg)]: next,
                            });
                        }
                    } else {
                        Object.assign(accumulator, { [stripSlash(arg)]: true });
                    }
                }
            }
            return accumulator;
        }, {} as T);
};

export default parser;
