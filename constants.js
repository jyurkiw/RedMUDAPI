/**
 * API constants.
 * 
 * @returns An organized constants structure.
 */
function Constants() {
    return {
        status: {
            WARN: 'warn',
            ERROR: 'err',
            OK: 'ok'
        },
        error_messages: {
            AREA_404: "Area %s not found.",
            AREA_POST_500: "Areacode and name are required."
        },
        warning_messages: {
            AREA_POST_NO_DESC: "Area description not found."
        }
    };
}

module.exports = Constants();