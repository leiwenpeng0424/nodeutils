import { describe, it, expect } from "vitest";
import { readJSON, readJSONSync } from "../src/json";

describe(`json operation`, () => {
    it(`readjson`, () => {
        const json = readJSONSync<{ name: string }>(`test/files/config.json`);
        expect(json.name).toEqual("config");
    });

    it("readjson sync", async function () {
        const json = await readJSON<{ name: string }>(`test/files/config.json`);
        expect(json.name).toEqual("config");
    });

    it("readjson throw error", () => {
        expect(() => {
            readJSONSync("a.json");
        }).toThrow(`ENOENT: no such file or directory, open 'a.json'`);
    });
});
