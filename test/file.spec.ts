import { describe, it, expect } from "vitest";
import { findFile, writeFile, writeFileSync } from "../src/file";

describe(`file operation`, () => {
    it(`it should write with no error`, () => {
        expect(async () => {
            await writeFile("./test/files/writeTest1.json", { name: "wp.l" });
            writeFileSync("./test/files/writeTest2.txt", "test2");
        }).not.throw();
    });

    it("should return config file path", async function () {
        const files = await findFile("config.json", ".");
        expect(files[0]).toEqual(
            "/Users/leiwenpeng/Developer/github/nodeutils/test/files/config.json"
        );
    });
});
