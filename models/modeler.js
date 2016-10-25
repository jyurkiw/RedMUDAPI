/**
 * Model assembly function. Assembles all models into one object that has access to everything.
 * Do this to abuse require() caching, and it give us access to every model in the
 * application with a single call.
 * 
 * @returns A modeler instance.
 */
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