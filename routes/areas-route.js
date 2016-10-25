/**
 * Areas routing.
 * Areas only has a GET call.
 * 
 * @returns An areas router.
 */
function AreaRoutes() {
    var express = require('express');
    var router = express.Router();
    var lib = require('redmudlib')(require('redis').createClient());

    var controller = require('../controllers/areas-controller');

    router
        .get('/areas', controller.areas);

    return router;
}

module.exports = AreaRoutes();