/**
 * User routing.
 * Users can be created.
 * 
 * @namespace user-route
 * @returns An user router.
 */
function UserRoutes() {
    var express = require('express');
    var router = express.Router();

    var controller = require('../controllers/user-controller');

    router.post('/user', controller.userPOST);

    return router;
}

module.exports = UserRoutes();