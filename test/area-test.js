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

        after(function(done) {
            client.flushall();
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

        after(function(done) {
            client.flushall();
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

        after(function(done) {
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
            var noDescKBV = modeler.area.build(koboldValleyArea.areacode, koboldValleyArea.name, null);
            var noDescKBVWarn = modeler.status.build(constants.status.WARN, koboldValleyArea.areacode, constants.warning_messages.AREA_POST_NO_DESC);

            chai.request(server)
                .post('/api/area')
                .send(noDescKBV)
                .end(function(err, res) {
                    res.should.have.status(200);

                    expect(res.body).to.deep.equal(noDescKBVWarn);
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
                .send(modeler.area.build(koboldValleyArea.areacode, null, koboldValleyArea.description))
                .end(function(err, res) {
                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    expect(res.body).to.deep.equal(errorKBV);
                    done();
                });
        });

        it('check kobold valley missing areacode', function(done) {
            var errorKBV = modeler.status.build(constants.status.ERROR, 'areacode', constants.error_messages.AREA_POST_500);

            chai.request(server)
                .post('/api/area')
                .send(modeler.area.build(null, koboldValleyArea.name, koboldValleyArea.description))
                .end(function(err, res) {
                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    expect(res.body).to.deep.equal(errorKBV);
                    done();
                });
        });

        it('check kobold valley missing size', function(done) {
            var noSizeKbv = Object.assign({}, koboldValleyArea);
            delete noSizeKbv.size;

            chai.request(server)
                .post('/api/area')
                .send(noSizeKbv)
                .end(function(err, res) {
                    res.should.have.status(200);

                    chai.request(server)
                        .get('/api/area/' + noSizeKbv.areacode)
                        .end(function(gerr, gres) {
                            console.log(gres.body);
                            gres.should.have.status(200);
                            gres.body.should.be.a('object');
                            should.exist(gres.body.size);
                            gres.body.size.should.be.a('number');
                            expect(gres.body.size).to.equal(0);

                            done();
                        });
                });
        });
    });

    describe('PUT Area', function() {
        beforeEach(function(done) {
            lib.setArea(koboldValleyArea.areacode, koboldValleyArea);
            done();
        });

        after(function(done) {
            client.flushall();
            done();
        });

        it('check successful update to kobold valley', function(done) {
            var gobArea = modeler.area.build(koboldValleyArea.areacode, goblinValleyArea.name, goblinValleyArea.description);
            delete gobArea.size;

            chai.request(server)
                .put('/api/area')
                .send(gobArea)
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    expect(res.body).to.deep.equal(modeler.status.ok(koboldValleyArea.areacode));

                    gobArea.size = goblinValleyArea.size;
                    chai.request(server)
                        .get('/api/area/' + koboldValleyArea.areacode)
                        .end(function(err, res) {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            expect(res.body).to.deep.equal(gobArea);
                            done();
                        });
                });
        });

        it('check successful partial update to kobold valley', function(done) {
            var gobArea = modeler.area.build(koboldValleyArea.areacode, goblinValleyArea.name, goblinValleyArea.description);
            delete gobArea.size;

            chai.request(server)
                .put('/api/area')
                .send(gobArea)
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    expect(res.body).to.deep.equal(modeler.status.ok(koboldValleyArea.areacode));

                    gobArea.size = goblinValleyArea.size;
                    chai.request(server)
                        .get('/api/area/' + koboldValleyArea.areacode)
                        .end(function(err, res) {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            expect(res.body).to.deep.equal(gobArea);
                            done();
                        });
                });
        });

        it('check for update fail with non-existent areacode', function(done) {
            var gobArea = modeler.area.build('XXX', goblinValleyArea.name, goblinValleyArea.description);
            delete gobArea.size;

            chai.request(server)
                .put('/api/area')
                .send(gobArea)
                .end(function(err, res) {
                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    expect(res.body).to.deep.equal(modeler.status.build(constants.status.ERROR, gobArea.areacode, constants.error_messages.AREA_404, gobArea.areacode));
                    done();
                });
        });

        it('check for update fail with missing areacode', function(done) {
            var gobArea = modeler.area.build(null, goblinValleyArea.name, goblinValleyArea.description);
            delete gobArea.size;

            chai.request(server)
                .put('/api/area')
                .send(gobArea)
                .end(function(err, res) {
                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    expect(res.body).to.deep.equal(modeler.status.build(constants.status.ERROR, 'areacode', constants.error_messages.AREA_404_NO_AREACODE));
                    done();
                });
        });

        it('check to make sure that size cannot be updated', function(done) {
            var gobArea = modeler.area.build(koboldValleyArea.areacode, goblinValleyArea.name, goblinValleyArea.description);
            gobArea.size = 5;

            chai.request(server)
                .put('/api/area')
                .send(gobArea)
                .end(function(err, res) {
                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    expect(res.body).to.deep.equal(modeler.status.build(constants.status.ERROR, gobArea.areacode, constants.error_messages.AREA_PUT_500_SIZE));
                    done();
                });
        });
    });

    describe('DELETE area', function() {
        beforeEach(function(done) {
            console.log('setting area');
            lib.setArea(koboldValleyArea.areacode, koboldValleyArea);
            done();
        });

        after(function(done) {
            client.flushall();
            done();
        });

        it('check successful delete', function(done) {
            chai.request(server)
                .del('/api/area/' + koboldValleyArea.areacode)
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    expect(res.body).to.deep.equal(modeler.status.ok(koboldValleyArea.areacode));
                    done();
                });
        });

        it('check fail delete for area size > 0', function(done) {
            client.hincrby('AREAS:' + koboldValleyArea.areacode, 'size', 5, function(herr, hres) {
                chai.request(server)
                    .del('/api/area/' + koboldValleyArea.areacode)
                    .end(function(err, res) {
                        res.should.have.status(500);
                        res.body.should.be.a('object');
                        expect(res.body).to.deep.equal(modeler.status.build(constants.status.ERROR, koboldValleyArea.areacode, constants.error_messages.AREA_DELETE_500_SIZE));
                        done();
                    });
            });
        });

        it('check fail delete for non-exist areacode', function(done) {
            chai.request(server)
                .del('/api/area/XXX')
                .end(function(err, res) {
                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    expect(res.body).to.deep.equal(modeler.status.build(constants.status.ERROR, 'XXX', constants.error_messages.AREA_DELETE_500_BAD_AREACODE));
                    done();
                });
        });
    });
});