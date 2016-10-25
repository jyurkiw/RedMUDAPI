var chai = require('chai');
chai.use(require('chai-http'));
var expect = chai.expect;
var assert = require('assert');

var modeler = require('../models/modeler');

var server = require('../server');

describe('Area', function() {
    it('check against the Kobold Valley', function(done) {
        chai.request(server)
            .get('/api/area')
            .end(function(err, res) {
                expect(res.body).to.deep.equal(modeler.area.build('KVD', 'Kobold Valley', 'A place with lots of kobolds.'));
                done();
            });
    });
});