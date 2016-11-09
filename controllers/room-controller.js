/**
 * Room controller.
 * 
 * @namespace room-controller
 * @returns A room controller access object.
 */
function roomController() {
    var lib = require('redmudlib')();
    var modeler = require('../models/modeler');
    var constants = require('../constants');

    function roomGET(req, res) {
        var areacode = req.params.areacode;
        var roomnumber = parseInt(req.params.roomnumber, 10);

        lib.room.async.getRoom(areacode, roomnumber)
            .then(function(room) {
                res.json(room);
            })
            .catch(function(err) {
                res.status(500);
                res.json(modeler.status.build(constants.status.ERROR, null, err));
            });
    }

    /**
     * POST method for room.
     * Create the room for the given area.
     * Return the completed room object.
     * 
     * @memberof room-controller
     * @param {any} req The request object. A room object param is required. Roomnumber will be scrubed.
     * @param {any} res The response object. The room object with roomnumber will be included.
     */
    function roomPOST(req, res) {
        var room = req.body;

        // Scrub any included roomnumber.
        if (typeof(room.roomnumber !== null)) {
            delete room.roomnumber;
        }

        lib.room.async.addRoom(room.areacode, room)
            .then(function(roomnumber) {
                room.roomnumber = roomnumber;

                res.json(room);
            })
            .catch(function(err) {
                res.status(500);
                res.json(modeler.status.build(constants.status.ERROR, null, err));
            });
    }

    /**
     * POST method for room exits.
     * Create an exit for a source room to a destination room with a given command.
     * 
     * The request body should contain an object with the following structure:
     * <pre><code>
     * {
     *      command:        {string},
     *      source:         {string|object},
     *      destination:    {string|object}
     * }
     * </code></pre>
     * 
     * @param {any} req The request object.
     * @param {any} res The response object.
     */
    function roomExitPOST(req, res) {
        var exit = req.body;

        if (typeof(exit) !== 'object') {
            res.status(500);
            res.json(modeler.status.build(constants.status.ERROR, null, constants.error_messages.ROOM_POST_500_EXIT));
        } else {
            lib.room.async.setConnection(exit.command, exit.source, exit.destination)
                .then(function() {
                    res.json(modeler.status.ok());
                })
                .catch(function(err) {
                    res.status(500);
                    res.json(modeler.status.build(constants.status.ERROR, null, err));
                });
        }
    }

    /**
     * Update a room's data.
     * Scrubs any roomnumber or areacode data from the passed room data
     * because they are not updatable fields.
     * Scrubs any exits. Exits are updated with their own methods.
     * 
     * @param {any} req The request object.
     * @param {any} res The response object.
     */
    function roomPUT(req, res) {
        var areacode = req.params.areacode;
        var roomnumber = parseInt(req.params.roomnumber, 10);
        var room = req.body;

        // Scrub areacode, roomnumber, and exits from room.
        // Areacode and roomnumber are readonly, while exits are
        // not updated here.
        delete room.areacode;
        delete room.roomnumber;
        delete room.exits;

        lib.room.async.setRoom(areacode, roomnumber, room)
            .then(function() {
                res.json(modeler.status.ok());
            })
            .catch(function(err) {
                res.status(500);
                res.json(modeler.status.build(constants.status.ERROR, null, err));
            });
    }

    /**
     * Delete a room from an area.
     * 
     * @param {any} req The request object.
     * @param {any} res The response object.
     */
    function roomDELETE(req, res) {
        var areacode = req.params.areacode;
        var roomnumber = parseInt(req.params.roomnumber, 10);

        lib.room.async.deleteRoom(areacode, roomnumber)
            .then(function() {
                res.json(modeler.status.ok());
            })
            .catch(function(err) {
                res.status(500);
                res.json(modeler.status.build(constants.status.ERROR, null, err));
            });
    }

    function roomExitDELETE(req, res) {
        var areacode = req.params.areacode;
        var roomnumber = parseInt(req.params.roomnumber, 10);
        var command = req.params.command;

        if (areacode === null || isNaN(roomnumber) || command === null) {
            res.status(500);
            res.json(modeler.status.build(constants.status.ERROR, null, AREA_DELETE_EXIT_500_BAD_PARAM));
            return;
        }

        lib.room.async.unsetConnection(command, lib.util.buildRoomCode(areacode, roomnumber))
            .then(function() {
                resolve();
            })
            .catch(function(err) {
                res.status(500);
                res.json(modeler.status.build(constants.status.ERROR, null, err));
            });
    }

    return {
        roomGET: roomGET,
        roomPOST: roomPOST,
        roomExitPOST: roomExitPOST,
        roomPUT: roomPUT,
        roomDELETE: roomDELETE,
        roomExitDELETE: roomExitDELETE
    };
}

module.exports = roomController();