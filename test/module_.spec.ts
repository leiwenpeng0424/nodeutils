import { describe, it, expect } from "vitest";
import { module_ } from "../src";

describe("import", () => {
    it("should get config", function () {
        let config;
        expect(() => {
            config = module_.import_("./test/files/config.json");
        }).not.throw();
        expect(config.name).toEqual("config");
    });

    it("should get config3", function () {
        let config;
        expect(() => {
            config = module_.import_("./test/files/config3.js");
        }).not.throw();
        expect(config.name).toEqual("config");
    });

    it("should get config4", function () {
        let config;
        expect(() => {
            config = module_.import_("./test/files/config4.ts");
        }).not.throw();
        expect(config.name).toEqual("config");
    });
});
