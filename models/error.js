/**
 * Error model builder class.
 * 
 * @namespace error-model
 * @returns An error builder access object.
 */
function error() {
    var util = require('util');
    var constants = require('../constants');

    /**
     * Build a blank error object.
     * 
     * @memberOf error-model
     * @returns A blank error.
     */
    function blank() {
        return {
            errorcode: null,
            msg: null
        };
    }

    /**
     * Populate a blank error object with the provided data.
     * Empty strings should be set to null and not an empty string.
     * 
     * @memberOf error-model
     * @param {string} errorcode
     * @param {string} name
     * @param {string} description
     * @returns A populated error object.
     */
    function build(errorcode, msg) {
        var error = blank();
        error.errorcode = errorcode;
        error.msg = msg;

        return error;
    }

    /**
     * Build a blank area error object.
     * 
     * @memberOf error-model
     * @returns A blank area error object.
     */
    function blankAreaError() {
        return {
            areacode: null,
            msg: null
        };
    }

    /**
     * Build an area error object.
     * 
     * @memberOf error-model
     * @param {string} areacode The erroring area code.
     * @returns A populated area error object.
     */
    function buildAreaError(areacode) {
        var error = blankAreaError();
        error.areacode = areacode;
        error.msg = util.format(constants.error_messages.AREA_404, areacode);

        return error;
    }

    return {
        error: {
            blank: blank,
            build: build,
            area: {
                blank: blankAreaError,
                build: buildAreaError
            }
        }
    };
}
module.exports = error();