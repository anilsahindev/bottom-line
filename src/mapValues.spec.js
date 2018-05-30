import mapValues, { REMOVE } from "./mapValues";
import _mapValues from "lodash/mapValues";

describe("mapValues", () => {
    const square = v => v * v;

    const obj = {
        a: 5,
        b: 6,
    };
    const result = {
        a: 25,
        b: 36,
    };

    it("returns new object, behaves like lodash", () => {
        mapValues(obj, square).must.not.equal(obj);
        _mapValues(obj, square).must.not.equal(obj);
    });

    it("maps values, behaves like lodash", () => {
        mapValues(obj, square).must.eql(result);
        _mapValues(obj, square).must.eql(result);
    });

    it("skips inherited properties, behaves like lodash", () => {
        const Test = function() {};
        Test.prototype.nonOwn = 1;
        const testInstance = new Test();
        testInstance.own = 2;
        const testInstanceResult = {
            own: 4,
        };

        mapValues(testInstance, square).must.eql(testInstanceResult);
        _mapValues(testInstance, square).must.eql(testInstanceResult);
    });

    it("skips non-enumerable properties, behaves like lodash", () => {
        const nonEnum = {
            enum: 1,
        };
        Object.defineProperty(nonEnum, "nonEnum", {
            enumerable: false,
            value: 5,
        });
        const nonEnumResult = {
            enum: 1,
        };

        mapValues(nonEnum, square).must.eql(nonEnumResult);
        _mapValues(nonEnum, square).must.eql(nonEnumResult);
    });

    it("keeps array an array, behaves NOT like lodash", () => {
        const array = [1, 5];
        array.property = 3;
        const arrayResult = [1, 25];
        arrayResult.property = 9;
        const arrayResultLodash = {
            0: 1,
            1: 25,
            property: 9,
        };

        mapValues(array, square).must.eql(arrayResult);
        _mapValues(array, square).must.eql(arrayResultLodash);
    });

    it("works on holey array, behaves NOT like lodash", () => {
        const holeyArray = [1,,3];
        const holeyArrayResult = [1,,9];
        const holeyArrayResultLodash = {
            0: 1,
            1: NaN,
            2: 9,
        };

        mapValues(holeyArray, square).must.eql(holeyArrayResult);
        _mapValues(holeyArray, square).must.eql(holeyArrayResultLodash);
    });

    it("allows filtering while mapping values", () => {
        const source = {
            title: "abc",
            price: 16.10,
            author: "dzek",
            items: [],
            data: {},
            category: null,
            description: "abcd",
        };

        mapValues(source, (value, key) => {
            const keyStartsWithCP = ["c", "p"].includes(key.substring(0, 1));
            const isString = typeof value === "string";
            if (!isString && !keyStartsWithCP) {
                return REMOVE;
            }
            if (typeof value === "number") {
                return value + 1;
            }
            if (key === "description") {
                return value.toUpperCase();
            }
            return value;
        }).must.eql({
            title: "abc",
            price: 17.10,
            author: "dzek",
            category: null,
            description: "ABCD",
        })
    });

    it("crashes on nil values, behaves NOT like lodash", () => {
        (() => mapValues(null, square)).must.throw();
        (() => mapValues(undefined, square)).must.throw();

        (() => _mapValues(null, square)).must.not.throw();
        (() => _mapValues(undefined, square)).must.not.throw();
    });
});