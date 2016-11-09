/**
 * Room routing.
 * Room has full CRUD support.
 * 
 * @namespace room-route
 * @returns A room router.
 */
function RoomRoutes() {
    var express = require('express');
    var router = express.Router();

    var roomController = require('../controllers/room-controller');
    var roomsController = require('../controllers/rooms-controller');

    // Room controller binding
    router.get('/room/:areacode/:roomnumber', roomController.roomGET);
    router.post('/room', roomController.roomPOST);
    router.post('/room/exit', roomController.roomExitPOST);
    router.put('/room/:areacode/:roomnumber', roomController.roomPUT);
    router.delete('/room/:areacode/:roomnumber', roomController.roomDELETE);

    // Rooms controller binding
    router.post('/rooms/exits', roomsController.roomsExitsPOST);

    return router;
}

module.exports = RoomRoutes();