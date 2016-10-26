/**
 * Area controller.
 * 
 * @namespace area-controller
 * @returns An area controller access object.
 */
function areasController() {
    var lib = require('redmudlib')(require('redis').createClient());
    var modeler = require('../models/modeler');
    var constants = require('../constants');

    /**
     * GET method for area.
     * Return the area for the given areacode,
     * or a 404 status and an areaError structure
     * containing the passed areacode.
     * 
     * @memberOf area-controller
     * @param {any} req The request object. An areacode param is expected.
     * @param {any} res The response object.
     */
    function areaGET(req, res) {
        lib.getArea(req.params.areacode, function(area) {
            if (area !== null) {
                var defaultedArea = Object.assign(modeler.area.blank(), area);
                res.json(defaultedArea);
            } else {
                res.status(404);
                res.json(modeler.status.build(constants.status.ERROR, req.params.areacode, constants.error_messages.AREA_404, req.params.areacode));
            }
        });
    }

    /**
     * POST method for area.
     * Returns a status object. See {@link statis-model}
     * 
     * @memberOf area-controller
     * @param {any} req The request object.
     * @param {any} res The response object.
     */
    function areaPOST(req, res) {
        var newArea = req.body;

        // validate newArea
        if (typeof(newArea) !== 'object' || typeof(newArea.areacode) === 'undefined' || newArea.areacode === null) {
            res.status(500);
            res.json(modeler.status.build(constants.status.ERROR, 'areacode', constants.error_messages.AREA_POST_500));
        } else if (typeof(newArea.name) === 'undefined' || newArea.name === null) {
            res.status(500);
            res.json(modeler.status.build(constants.status.ERROR, newArea.areacode, constants.error_messages.AREA_POST_500));
        } else {
            res.status(200);

            var response = null;

            // validate description for warnings
            if (typeof(newArea.description) === 'undefined' || newArea.description === null || newArea.description.length === 0) {
                response = modeler.status.build(constants.status.WARN, newArea.areacode, constants.warning_messages.AREA_POST_NO_DESC);
                delete newArea.description;
            } else {
                response = modeler.status.ok(newArea.areacode);
            }

            lib.setArea(newArea.areacode, newArea);
            res.json(response);
        }
    }

    /**
     * PUT method for area.
     * Returns a status object. See {@link statis-model}
     * 
     * @memberOf area-controller
     * @param {any} req
     * @param {any} res
     */
    function areaPUT(req, res) {
        var areaUpdate = req.body;

        // Make sure areacode exists at all
        if (areaUpdate === null || typeof(areaUpdate) !== 'object' || areaUpdate.areacode === null || typeof(areaUpdate.areacode) !== 'string') {
            res.status(500);
            res.json(modeler.status.build(constants.status.ERROR, 'areacode', constants.error_messages.AREA_404_NO_AREACODE));
        } else if (typeof(areaUpdate.size) !== 'undefined') {
            res.status(500);
            res.json(modeler.status.build(constants.status.ERROR, areaUpdate.areacode, constants.error_messages.AREA_PUT_500_SIZE));
        } else {
            // Check for areacode validity
            lib.areaExists(areaUpdate.areacode, function(exists) {
                if (exists) {
                    // Update the area
                    lib.setArea(areaUpdate.areacode, areaUpdate);

                    res.json(modeler.status.ok(areaUpdate.areacode));
                } else {
                    res.status(500);
                    res.json(modeler.status.build(constants.status.ERROR, areaUpdate.areacode, constants.error_messages.AREA_404, areaUpdate.areacode));
                }
            });
        }
    }

    function areaDELETE(req, res) {
        lib.getArea(req.params.areacode, function(area) {
            if (area !== null) {
                if (area.size > 0) {
                    res.status(500);
                    res.json(modeler.status.build(constants.status.ERROR, area.areacode, constants.error_messages.AREA_DELETE_500_SIZE));
                } else {
                    lib.deleteArea(area.areacode);
                    res.json(modeler.status.ok(area.areacode));
                }
            } else {
                res.status(500);
                res.json(modeler.status.build(constants.status.ERROR, req.params.areacode, constants.error_messages.AREA_DELETE_500_BAD_AREACODE));
            }
        });
    }

    return {
        areaGET: areaGET,
        areaPOST: areaPOST,
        areaPUT: areaPUT,
        areaDELETE: areaDELETE
    };
}

module.exports = areasController();