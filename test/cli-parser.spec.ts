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

    it("array argument", () => {
        const result = parser<{ input: string[]; name: string; age: string }>([
            "beats",
            "--watch",
            "--input",
            "src/index.ts",
            "--input",
            "src/cli.ts",
            "--go",
            "--name=leiwenpeng",
            "--age=12",
        ]);
        console.log(result);
        expect(result.input.length).toEqual(2);
    });
});
