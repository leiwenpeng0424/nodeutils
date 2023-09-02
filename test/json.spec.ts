import { describe, it, expect } from "vitest";
import * as Json from "../src/json";

describe(`json operation`, () => {
    it(`readjson`, () => {
        const json = Json.readJSONSync<{ include: string[] }>(
            `./test/files/config.json`
        );
        expect(json.include).toEqual(["src/"]);
    });

    it("readjson async", async function () {
        const json = await Json.readJSON<{ include: string[] }>(
            `./test/files/config.json`
        );
        expect(json.include).toEqual(["src/"]);
    });

    it("readjson throw error", () => {
        expect(() => {
            Json.readJSONSync("a.json");
        }).toThrow(`ENOENT: no such file or directory, open 'a.json'`);
    });
});
