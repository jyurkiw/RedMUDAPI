/**
 * Areas controller.
 * 
 * @namespace areas-controller
 * @returns An areas controller access object.
 */
function areasController() {
    var lib = require('redmudlib')(require('redis').createClient());

    /**
     * 
     * @memberOf areas-controller
     * @param {any} req
     * @param {any} res
     */
    function areasGET(req, res) {
        lib.getAreas(function(area) {
            res.json(area.sort());
        });
    }

    return {
        areasGET: areasGET
    };
}

module.exports = areasController();