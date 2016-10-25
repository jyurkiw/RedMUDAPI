/**
 * Area routing.
 * Area has full CRUD support.
 * 
 * @namespace area-route
 * @returns An area router.
 */
function AreaRoutes() {
    var express = require('express');
    var router = express.Router();

    var controller = require('../controllers/area-controller');

    router.get('/area/:areacode', controller.areaGET);

    return router;
}

module.exports = AreaRoutes();