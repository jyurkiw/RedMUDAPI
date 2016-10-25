function AreaRoutes() {
    var express = require('express');
    var router = express.Router();

    // test code. will remove
    var modeler = require('../models/modeler');

    router.get('/area', function(req, res) {
        res.json(modeler.area.build('KVD', 'Kobold Valley', 'A place with lots of kobolds.'));
    });

    return router;
}

module.exports = AreaRoutes();