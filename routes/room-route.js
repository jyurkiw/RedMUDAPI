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
    router.delete('/room/exit/:areacode/:roomnumber/:command', roomController.roomExitDELETE);

    // Rooms controller binding
    router.get('/rooms/exits/lookup', roomsController.adminRoomsByAreaGET);
    router.get('/rooms/exits/lookup/:areacode', roomsController.adminRoomsInAreaGET);
    router.post('/rooms/exits', roomsController.roomsExitsPOST);
    router.delete('/rooms/exits/:areacodeA/:roomnumberA/:areacodeB/:roomnumberB', roomsController.roomsExitsDELETE);

    return router;
}

module.exports = RoomRoutes();