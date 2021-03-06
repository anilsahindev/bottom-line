/**
 * Returns new object with copied given properties from source object.
 *
 * @param {Object} object - source object
 * @param {Array.<string>} props - properties to copy
 * @example
 * pick({ name: "Jack", age: 69 }, ["age", "title"]);
 * // { age: 69 }
 * @example
 * pick(["hello", "world"], [0]);
 * // { 0: hello }
 * @returns {Object} - new object with given properties
 */
const pick = (object, props) => {
    if (
        !object
        || (typeof object !== "object" && typeof object !== "function")
        || !Array.isArray(props)
        || !props.length
    ) {
        return {};
    }
    const result = {};
    props.forEach(property => {
        if (property in object) {
            result[property] = object[property];
        }
    });
    return result;
};

export default pick;
