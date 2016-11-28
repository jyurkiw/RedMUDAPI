var chai = require('chai');
chai.use(require('chai-http'));
var expect = chai.expect;
var should = chai.should();
var assert = require('assert');

var lib = require('redmudlib')();
var client = lib.client.instance();

var modeler = require('../models/modeler');
var constants = require('../constants');

var sha256 = require('js-sha256').sha256;
var server = require('../server');

var username1 = 'testUser1';
var pwhash1 = sha256('12345');

var username2 = 'testUser2';
var pwhash2 = sha256('23456');

describe('User API', function() {
    beforeEach(function() {
        return client.flushallAsync();
    });

    after(function() {
        return client.flushallAsync();
    });

    describe('POST', function() {
        it('Create a user', function(done) {
            chai.request(server)
                .post('/api/user')
                .send({ username: username1, pwhash: pwhash1 })
                .end(function(err, res) {
                    res.should.have.status(200);
                    expect(res.body).to.deep.equal(modeler.status.ok("User Created successfully."));
                    done();
                });
        });

        it('Create two users', function(done) {
            chai.request(server)
                .post('/api/user')
                .send({ username: username1, pwhash: pwhash1 })
                .end(function(err, res) {
                    res.should.have.status(200);
                    expect(res.body).to.deep.equal(modeler.status.ok("User Created successfully."));

                    chai.request(server)
                        .post('/api/user')
                        .send({ username: username2, pwhash: pwhash2 })
                        .end(function(err, res) {
                            res.should.have.status(200);
                            expect(res.body).to.deep.equal(modeler.status.ok("User Created successfully."));
                            done();
                        });
                });
        });

        it('Creating an existing user should fail', function(done) {
            chai.request(server)
                .post('/api/user')
                .send({ username: username1, pwhash: pwhash1 })
                .end(function(err, res) {
                    res.should.have.status(200);
                    expect(res.body).to.deep.equal(modeler.status.ok("User Created successfully."));

                    chai.request(server)
                        .post('/api/user')
                        .send({ username: username1, pwhash: pwhash2 })
                        .end(function(err, res) {
                            res.should.have.status(500);
                            expect(res.body).to.deep.equal(modeler.status.build(constants.status.ERROR, null, 'A user by that name already exists.'));
                            done();
                        });
                });
        });
    });
});