import parser from "../src/cli-parser";
import { describe, expect, it } from "vitest";

describe("parser test", () => {
    it("boolean argument", () => {
        const { watch, sourcemap } = parser([
            "beats",
            "--watch",
            "--sourcemap",
        ]);
        expect(watch).toEqual(true);
        expect(sourcemap).toEqual(true);
    });

    it("normal argument", () => {
        const { input } = parser(["beats", "--input", "src/index.ts"]);
        expect(input).toEqual("src/index.ts");
    });
});
