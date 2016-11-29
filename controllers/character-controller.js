/**
 * Controller for characters.
 * 
 * @namespace character
 * @returns An access object.
 */
function characterController() {
    var lib = require('redmudlib')(require('redis').createClient());
    var modeler = require('../models/modeler');
    var constants = require('../constants');

    /**
     * Character POST controller. Create a new Character.
     * 
     * @memberof user
     * @param {any} req A request object.
     * @param {any} res A response object.
     */
    function characterPOST(req, res) {
        lib.character.async.createCharacter(req.body.username, req.body.charactername, req.body.defaultroom)
            .then(function(success) {
                if (success) {
                    res.json(modeler.status.ok(null));
                } else {
                    res.status(500);
                    res.json(modeler.status.build(constants.status.ERROR, null, "Character Creation Failed."));
                }
            })
            .catch(function(err) {
                res.status(500);
                res.json(modeler.status.build(constants.status.ERROR, null, err));
            });
    }

    return {
        characterPOST: characterPOST
    };
}

module.exports = characterController();