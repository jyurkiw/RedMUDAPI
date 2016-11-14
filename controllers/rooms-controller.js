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

    function adminRoomsInAreaGET(req, res) {
        var areacode = req.params.areacode;

        lib.admin.room.async.getRoomLookupTableByArea(areacode)
            .then(function(lookupTable) {
                res.json(lookupTable);
            });
    }

    /**
     * Post exits between two rooms.
     * 
     * @memberof rooms-controller
     * @param {any} req Request object
     * @param {any} res Response object
     */
    function roomsExitsPOST(req, res) {
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

    /**
     * Remove exits between two rooms.
     * 
     * @memberof rooms-controller
     * @param {any} req Request object
     * @param {any} res Response object
     */
    function roomsExitsDELETE(req, res) {
        Promise.all([
                lib.room.async.getRoom(req.params.areacodeA, parseInt(req.params.roomnumberA, 10)),
                lib.room.async.getRoom(req.params.areacodeB, parseInt(req.params.roomnumberB, 10))
            ])
            .then(function(rooms) {
                if (rooms.length == 2) {
                    return lib.room.async.disconnectRooms(rooms[0], rooms[1]);
                } else {
                    res.status(500);
                    res.json(modeler.status.build(constants.status.ERROR, null, rooms));
                    return;
                }
            })
            .then(function() {
                res.json(modeler.status.ok());
            })
            .catch(function(err) {
                res.status(500);
                res.json(modeler.status.build(constants.status.ERROR, null, err));
            });
    }

    return {
        adminRoomsInAreaGET: adminRoomsInAreaGET,
        roomsExitsPOST: roomsExitsPOST,
        roomsExitsDELETE: roomsExitsDELETE
    };
}

module.exports = roomsController();