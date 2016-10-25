/**
 * Area model builder class.
 * 
 * @namespace area-model
 * @returns An area builder access object.
 */
function area() {
    /**
     * Build a blank area object.
     * 
     * @memberOf area-model
     * @returns A blank area.
     */
    function blank() {
        return {
            areacode: null,
            name: null,
            description: null,
            size: 0
        };
    }

    /**
     * Populate a blank area object with the provided data.
     * Empty strings should be set to null and not an empty string.
     * 
     * @memberOf area-model
     * @param {string} areacode
     * @param {string} name
     * @param {string} description
     * @returns A populated area object.
     */
    function build(areacode, name, description) {
        var area = blank();
        area.areacode = areacode;
        area.name = name;
        area.description = description;

        return area;
    }

    return {
        area: {
            blank: blank,
            build: build
        }
    };
}
module.exports = area();