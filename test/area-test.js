var chai = require('chai');
chai.use(require('chai-http'));
var expect = chai.expect;
var should = chai.should();
var assert = require('assert');

var client = require('redis').createClient();
var lib = require('redmudlib')(client);

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

var errorObj404 = modeler.error.area.build('XXX');

describe('Area API', function() {
    describe('GET Areas', function() {
        before(function(done) {
            lib.setArea(koboldValleyArea.areacode, koboldValleyArea);
            lib.setArea(goblinValleyArea.areacode, goblinValleyArea);
            done();
        });

        it('check areas', function(done) {
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
    /*
        describe('GET/PUT/DELETE Area', function() {
            beforeEach(function(done) {
                client.flushall();
                lib.setArea(koboldValleyArea.areacode, koboldValleyArea);
                done();
            });

            it('check the kobold valley', function(done) {
                chai.request(server)
                    .get('/api/area/' + koboldValleyArea.areacode)
                    .end(function(err, res) {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        expect(res.body).to.deep.equal(koboldValleyArea);
                        done();
                    });
            });

            it('check a bogus area', function(done) {
                chai.request(server)
                    .get('/api/area/' + errorObj404.areacode)
                    .end(function(err, res) {
                        res.should.have.status(404);
                        res.body.should.be.a('object');
                        expect(res.body).to.deep.equal(errorObj404);
                        done();
                    });
            });
        });
    */
    describe('POST Area', function() {

    });
});