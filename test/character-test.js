var chai = require('chai');
chai.use(require('chai-http'));
var expect = chai.expect;
var should = chai.should();
var assert = require('assert');

var sha256 = require('js-sha256').sha256;
var lib = require('redmudlib')();
var client = lib.client.instance();

var modeler = require('../models/modeler');
var constants = require('../constants');

var server = require('../server');

var username1 = "testUser1";
var username2 = "testUser2";

var pwhash = sha256('12345');

var charactername1 = "Alder";
var charactername2 = "Therda";

var koboldValleyArea = {
    areacode: 'KDV',
    name: "Kobold Valley",
    description: "A valley filled with dangerous Kobolds.",
    size: 0
};

var westernOverlook = {
    areacode: koboldValleyArea.areacode,
    roomnumber: 1,
    name: 'Western Overlook',
    description: 'A short cliff overlooks a small, fertile valley. You can see scores of Kobolds milling about doing whatever it is Kobolds do.'
};

describe('Create Characters', function() {
    beforeEach(function() {
        return client.flushallAsync()
            .then(function() {
                return lib.area.async.createArea(koboldValleyArea.areacode, koboldValleyArea);
            })
            .then(function() {
                return Promise.all([
                    lib.room.async.addRoom(westernOverlook.areacode, westernOverlook),
                    lib.user.async.createUser(username1, pwhash)
                ]);
            });
    });

    after(function() {
        return client.flushallAsync();
    });

    it('One character', function(done) {
        chai.request(server)
            .post('/api/character')
            .send({ username: username1, charactername: charactername1, defaultroom: lib.util.buildRoomCode(westernOverlook.areacode, westernOverlook.roomnumber) })
            .end(function(err, res) {
                res.should.have.status(200);
                return Promise.all([
                        client.sismemberAsync('CHARACTERS', charactername1),
                        client.sismemberAsync(lib.util.buildUserCharacterCode(username1), charactername1),
                        client.existsAsync(lib.util.buildCharacterCode(charactername1))
                    ])
                    .then(function(results) {
                        results[0].should.equal(1);
                        results[1].should.equal(1);
                        results[2].should.equal(1);
                        done();
                    });
            });
    });

    it('Two characters', function(done) {
        chai.request(server)
            .post('/api/character')
            .send({ username: username1, charactername: charactername1, defaultroom: lib.util.buildRoomCode(westernOverlook.areacode, westernOverlook.roomnumber) })
            .end(function(err, res) {
                res.should.have.status(200);
                return Promise.all([
                        client.sismemberAsync('CHARACTERS', charactername1),
                        client.sismemberAsync(lib.util.buildUserCharacterCode(username1), charactername1),
                        client.existsAsync(lib.util.buildCharacterCode(charactername1))
                    ])
                    .then(function(results) {
                        results[0].should.equal(1);
                        results[1].should.equal(1);
                        results[2].should.equal(1);

                        chai.request(server)
                            .post('/api/character')
                            .send({ username: username1, charactername: charactername2, defaultroom: lib.util.buildRoomCode(westernOverlook.areacode, westernOverlook.roomnumber) })
                            .end(function(err, res) {
                                res.should.have.status(200);
                                return Promise.all([
                                        client.sismemberAsync('CHARACTERS', charactername2),
                                        client.sismemberAsync(lib.util.buildUserCharacterCode(username1), charactername2),
                                        client.existsAsync(lib.util.buildCharacterCode(charactername2))
                                    ])
                                    .then(function(results) {
                                        results[0].should.equal(1);
                                        results[1].should.equal(1);
                                        results[2].should.equal(1);
                                        done();
                                    });
                            });
                    });
            });
    });

    it('Fail to make the same character twice', function(done) {
        chai.request(server)
            .post('/api/character')
            .send({ username: username1, charactername: charactername1, defaultroom: lib.util.buildRoomCode(westernOverlook.areacode, westernOverlook.roomnumber) })
            .end(function(err, res) {
                res.should.have.status(200);
                return Promise.all([
                        client.sismemberAsync('CHARACTERS', charactername1),
                        client.sismemberAsync(lib.util.buildUserCharacterCode(username1), charactername1),
                        client.existsAsync(lib.util.buildCharacterCode(charactername1))
                    ])
                    .then(function(results) {
                        results[0].should.equal(1);
                        results[1].should.equal(1);
                        results[2].should.equal(1);
                        chai.request(server)
                            .post('/api/character')
                            .send({ username: username1, charactername: charactername1, defaultroom: lib.util.buildRoomCode(westernOverlook.areacode, westernOverlook.roomnumber) })
                            .end(function(err, res) {
                                res.should.have.status(500);
                                res.body.status.should.equal('err');
                                res.body.msg.should.equal('A character by that name already exists.');
                                done();
                            });
                    });
            });
    });
});