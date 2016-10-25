/**
 * Area controller.
 * 
 * @namespace area-controller
 * @returns An area controller access object.
 */
function areasController() {
    var lib = require('redmudlib')(require('redis').createClient());
    var modeler = require('../models/modeler');

    /**
     * GET method for area.
     * Return the area for the given areacode,
     * or a 404 status and an areaError structure
     * containing the passed areacode.
     * 
     * @memberOf area-controller
     * @param {any} req The request object. An areacode param is expected.
     * @param {any} res The result object.
     */
    function areaGET(req, res) {
        lib.getArea(req.params.areacode, function(area) {
            if (area !== null) {
                res.json(area);
            } else {
                res.status(404);
                res.json(modeler.error.area.build(req.params.areacode));
            }
        });
    }

    return {
        areaGET: areaGET
    };
}

module.exports = areasController();