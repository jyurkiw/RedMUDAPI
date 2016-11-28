/**
 * Areas routing.
 * Areas only has a GET call.
 * 
 * @namespace areas-route
 * @returns An areas router.
 */
function AreasRoutes() {
    var express = require('express');
    var router = express.Router();

    var controller = require('../controllers/areas-controller');

    router
        .get('/areas', controller.areasGET);

    return router;
}

module.exports = AreasRoutes();