function areasController() {
    var lib = require('redmudlib')(require('redis').createClient());

    function areas(req, res) {
        lib.getAreas(function(area) {
            res.json(area);
        });
    }

    return {
        areas: areas
    };
}

module.exports = areasController();