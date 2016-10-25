/**
 * Status model builder class.
 * 
 * @namespace status-model
 * @returns A status builder access object.
 */
function nonDataStatusResponse() {
    var util = require('util');
    var constants = require('../constants');

    /**
     * 
     * 
     * @returns
     */
    function blank() {
        return {
            status: null,
            info: null,
            msg: null
        };
    }

    /**
     * 
     * 
     * @param {any} status
     * @param {any} info
     * @param {any} msg
     * @returns
     */
    function build(status, info, msg) {
        var st = blank();
        st.status = status;
        st.info = info;

        if (arguments.length === 3) {
            st.msg = msg;
        } else if (arguments.length === 4 && typeof(arguments[3]) === 'string') {
            st.msg = util.format(msg, arguments[3]);
        }

        return st;
    }

    return {
        status: {
            blank: blank,
            build: build
        }
    };
}
module.exports = nonDataStatusResponse();