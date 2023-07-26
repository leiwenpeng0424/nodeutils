import { describe, it, expect } from "vitest";
import { json as Json } from "..";

describe(`json operation`, () => {
    it(`readjson`, () => {
        const json = Json.readJSONSync<{ name: string }>(
            `test/files/config.json`
        );
        expect(json.name).toEqual("config");
    });

    it("readjson sync", async function () {
        const json = await Json.readJSON<{ name: string }>(
            `test/files/config.json`
        );
        expect(json.name).toEqual("config");
    });

    it("readjson throw error", () => {
        expect(() => {
            Json.readJSONSync("a.json");
        }).toThrow(`ENOENT: no such file or directory, open 'a.json'`);
    });
});
