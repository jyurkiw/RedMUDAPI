/**
 * Rooms controller.
 * 
 * @namespace rooms-controller
 * @returns A rooms controller access object.
 */
function roomsController() {
    var lib = require('redmudlib')();
    var modeler = require('../models/modeler');
    var constants = require('../constants');

    function roomsExitsPOST(req, res) {
        if (typeof(req.body) !== 'object') {
            res.status(500);
            res.json(modeler.status.build(constants.status.ERROR, null, constants.error_messages.ROOMS_POST_500_NOARG));
            return;
        } else if (typeof(req.body.roomA) !== 'object') {
            res.status(500);
            res.json(modeler.status.build(constants.status.ERROR, null, constants.error_messages.ROOMS_POST_500_BADARG));
            return;
        } else if (typeof(req.body.roomB) !== 'object') {
            res.status(500);
            res.json(modeler.status.build(constants.status.ERROR, null, constants.error_messages.ROOMS_POST_500_BADARG));
            return;
        }

        var roomA = req.body.roomA;
        var roomB = req.body.roomB;

        lib.room.async.connectRooms(roomA, roomB)
            .then(function() {
                res.json(modeler.status.ok());
            })
            .catch(function(err) {
                res.status(500);
                res.json(modeler.status.build(constants.status.ERROR, null, err));
            });
    }

    return {
        roomsExitsPOST: roomsExitsPOST
    };
}

module.exports = roomsController();