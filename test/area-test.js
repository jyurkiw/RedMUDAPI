var chai = require('chai');
chai.use(require('chai-http'));
var expect = chai.expect;
var should = chai.should;
var assert = require('assert');

var lib = require('redmudlib')(require('redis').createClient());

var modeler = require('../models/modeler');

var server = require('../server');

var koboldValleyArea = {
    areacode: 'KDV',
    name: "Kobold Valley",
    description: "A valley filled with dangerous Kobolds.",
    size: 0
};

var goblinValleyArea = {
    areacode: 'GCV',
    name: "Goblin Cave",
    description: "A cave filled with goblins.",
    size: 0
};

describe('Area API', function() {
    describe('GET Areas', function() {
        before(function(done) {
            lib.setArea(koboldValleyArea.areacode, koboldValleyArea);
            lib.setArea(goblinValleyArea.areacode, goblinValleyArea);
            done();
        });

        it('check against the Kobold Valley', function(done) {
            chai.request(server)
                .get('/api/areas')
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    expect(res.body).to.deep.equal([koboldValleyArea.areacode, goblinValleyArea.areacode].sort());
                    done();
                });
        });
    });
});