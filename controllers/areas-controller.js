/**
 * Areas controller.
 * 
 * @namespace area-controller
 * @returns An area controller access object.
 */
function areasController() {
    var lib = require('redmudlib')(require('redis').createClient());

    /**
     * 
     * @memberOf area-controller
     * @param {any} req
     * @param {any} res
     */
    function areas(req, res) {
        lib.getAreas(function(area) {
            res.json(area);
        });
    }

    return {
        areas: areas
    };
}

module.exports = areasController();