function AreaRoutes() {
    var express = require('express');
    var router = express.Router();
    var lib = require('redmudlib')(require('redis').createClient());

    // test code. will remove
    var modeler = require('../models/modeler');

    router
        .get('/areas', function(req, res) {
            //res.json(modeler.area.build('KVD', 'Kobold Valley', 'A place with lots of kobolds.'));
            lib.getAreas(function(area) {
                res.json(area);
            });
        });

    return router;
}

module.exports = AreaRoutes();