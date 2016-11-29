/**
 * Character routing.
 * Characters can be created.
 * 
 * @namespace Character-route
 * @returns An Character router.
 */
function CharacterRoutes() {
    var express = require('express');
    var router = express.Router();

    var controller = require('../controllers/character-controller');

    router.post('/character', controller.characterPOST);

    return router;
}

module.exports = CharacterRoutes();