import { describe, expect, it } from "vitest";
import colors from "../src/colors";

describe(`print all color with no error`, () => {
    it("should not throw", function () {
        expect(() => {
            const colorsKey = Object.keys(colors);
            new Array(colorsKey.length).fill(0).forEach((_, i) => {
                const fn = colors[colorsKey[i]];
                console.log(fn(i));
            });
        }).not.throw();
    });
});
