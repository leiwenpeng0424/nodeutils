import { describe, it, expect } from "vitest";
import { ms } from "../src";

describe(`ms test case`, () => {
    it("should return correct format", function () {
        const s = ms(1000, {
            precision: 0,
        });
        expect(s).toEqual("1s");
    });

    it("should return correct format", function () {
        const s = ms(1500, {
            precision: 1,
        });
        expect(s).toEqual("1.5s");
    });

    it("should return correct format", function () {
        const s = ms(6500, {
            precision: 2,
        });
        expect(s).toEqual("6.50s");
    });

    it("should return correct format", function () {
        const s = ms(16500, {
            precision: 3,
        });
        expect(s).toEqual("16.500s");
    });

    it("should return correct format", function () {
        const s = ms(1116500, {
            precision: 2,
        });
        expect(s).toEqual("18.61m");
    });

    it("should return correct format", function () {
        const s = ms(11116500, {
            precision: 2,
        });
        expect(s).toEqual("3.09h");
    });

    it("should return correct format", function () {
        const s = ms(111116500, {
            precision: 2,
        });
        expect(s).toEqual("1.29d");
    });
});
