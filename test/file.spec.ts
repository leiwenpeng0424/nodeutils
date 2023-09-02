import nodeFs from "node:fs";
import { describe, expect, it } from "vitest";
import { copySync, findFile, writeFile, writeFileSync } from "../src/file";

describe(`file operation`, () => {
    it(`it should write with no error`, () => {
        expect(async () => {
            await writeFile("./test/files/writeTest1.json", { name: "wp.l" });
            writeFileSync("./test/files/writeTest2.txt", "test2");
        }).not.throw();
    });

    it("should copy to destination", () => {
        copySync("test/files", "test/filesCopy");
        expect(nodeFs.existsSync("./test/filesCopy/config3.js")).toEqual(true);
    });

    it("should return config file path", async function () {
        const file = findFile("config.json", ".");
        // rmdirSync("test/filesCopy");
        expect(file).toEqual(
            "/Users/leiwenpeng/Developer/github/nodeutils/test/filesCopy/config.json"
        );
    });
});
