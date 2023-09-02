import { describe, it, expect } from "vitest";
import { module_ } from "../src";

describe("import", () => {
    it("should get config3", function () {
        let config;
        expect(() => {
            config = module_.import_("./test/files/config2.json");
        }).not.throw();
        console.log(config);
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
