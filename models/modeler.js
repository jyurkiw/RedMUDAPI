function Modeler() {
    var libs = [];

    libs.push(require('./area'));
    libs.push(require('./error'));

    var models = {};

    for (var i = 0; i < libs.length; i++) {
        var lib = libs[i];

        for (var func in lib) {
            models[func] = lib[func];
        }
    }

    return models;
}

module.exports = Modeler();