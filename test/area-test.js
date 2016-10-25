var chai = require('chai');
chai.use(require('chai-http'));
var expect = chai.expect;
var should = chai.should();
var assert = require('assert');

var client = require('redis').createClient();
var lib = require('redmudlib')(client);

var modeler = require('../models/modeler');
var constants = require('../constants');

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

var errorObj404 = modeler.status.build(constants.status.ERROR, 'XXX', constants.error_messages.AREA_404, 'XXX');

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
                .get('/api/area/' + errorObj404.info)
                .end(function(err, res) {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    expect(res.body).to.deep.equal(errorObj404);
                    done();
                });
        });
    });

    describe('POST Area', function() {
        beforeEach(function(done) {
            client.flushall();
            done();
        });

        it('check fully formed kobold valley', function(done) {
            chai.request(server)
                .post('/api/area')
                .send(koboldValleyArea)
                .end(function(err, res) {
                    res.should.have.status(200);
                    done();
                });
        });

        it('check kobold valley missing description', function(done) {
            var noDescKBV = modeler.status.build(constants.status.WARN, koboldValleyArea.areacode, constants.error_messages.AREA_POST_NO_DESC);

            chai.request(server)
                .post('/api/area')
                .send(noDescKBV)
                .end(function(err, res) {
                    res.should.have.status(200);

                    chai.request(server)
                        .get('/api/area/' + koboldValleyArea.areacode)
                        .end(function(err, res) {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            expect(res.body).to.deep.equal(noDescKBV);
                            done();
                        });
                });
        });

        it('check kobold valley missing name', function(done) {
            var errorKBV = modeler.status.build(constants.status.ERROR, koboldValleyArea.areacode, constants.error_messages.AREA_POST_500);

            chai.request(server)
                .post('/api/area')
                .send(koboldValleyArea)
                .end(function(err, res) {
                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    expect(res.body).to.deep.equal(erroKBV);
                    done();
                });
        });
    });
});