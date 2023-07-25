import { describe, it, expect } from "vitest";
import {
    findFile,
    writeFile,
    writeFileSync,
    copySync,
    rmdirSync,
} from "../src/file";
import nodeFs from "node:fs";

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
        rmdirSync("test/filesCopy");
        const file = findFile("config.json", ".");
        expect(file).toEqual(
            "/Users/leiwenpeng/Developer/github/nodeutils/test/files/config.json"
        );
    });
});
