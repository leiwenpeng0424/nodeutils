import { describe, expect, it } from "vitest";
import * as m from "../src/m";

describe("import", () => {
    it("should get config3", function () {
        let config;
        expect(() => {
            config = m.import_("./test/files/config2.json");
        }).not.throw();
        console.log(config);
        expect(config.name).toEqual("config");
    });

    it("should get config4", function () {
        let config;
        expect(() => {
            config = m.import_("./test/files/config4.ts");
        }).not.throw();
        expect(config.name).toEqual("config");
    });
});
