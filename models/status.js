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
     * Build a blank status object.
     * <pre><code>
     * {
     *      status: null,
     *      info: null,
     *      msg: null
     * }
     * </code></pre>
     * 
     * @memberOf status-model
     * @returns A blank status object.
     */
    function blank() {
        return {
            status: null,
            info: null,
            msg: null
        };
    }

    /**
     * Build a populated status object.
     * <pre><code>
     * {
     *      status: {status},
     *      info: {info},
     *      msg: {msg}
     * }
     * </code></pre>
     * 
     * @memberOf status-model
     * @param {any} status The status to set (err|warn|ok)
     * @param {any} info Relevant status info.
     * @param {any} msg A short status message.
     * @returns A status object.
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

    /**
     * Build a default OK status object.
     * 
     * @memberOf status-model
     * @param {any} info Relevant information (optional).
     * @returns A default OK status object.
     */
    function ok(info) {
        var st = blank();
        st.status = constants.status.OK;

        if (info !== null) {
            st.info = info;
        }

        return st;
    }

    return {
        status: {
            blank: blank,
            build: build,
            ok: ok
        }
    };
}
module.exports = nonDataStatusResponse();