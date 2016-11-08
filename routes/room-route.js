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

    var controller = require('../controllers/room-controller');

    router.get('/room/:areacode/:roomnumber', controller.roomGET);
    router.post('/room', controller.roomPOST);
    router.post('/room/exit', controller.roomExitPOST);
    router.put('/room/:areacode/:roomnumber', controller.roomPUT);
    router.delete('/room/:areacode/:roomnumber', controller.roomDELETE);

    return router;
}

module.exports = RoomRoutes();