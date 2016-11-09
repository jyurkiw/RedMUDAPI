var chai = require('chai');
chai.use(require('chai-http'));
var expect = chai.expect;
var should = chai.should();
var assert = require('assert');

var lib = require('redmudlib')();
var client = lib.client.instance();

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

var westernOverlook = {
    areacode: koboldValleyArea.areacode,
    roomnumber: 1,
    name: 'Western Overlook',
    description: 'A short cliff overlooks a small, fertile valley. You can see scores of Kobolds milling about doing whatever it is Kobolds do.'
};

var goblinCaveEntrance = {
    areacode: goblinValleyArea.areacode,
    roomnumber: 1,
    name: 'Cave Entrance',
    description: 'The opening to this dank cave reeks of Goblin.'
};

var goblinCaveTunnel = {
    areacode: goblinValleyArea.areacode,
    roomnumber: 2,
    name: 'Narrow Corridor',
    description: 'The cave stretches on into the darkness. '
};

var westernOverlookUpdate = {
    name: 'Western Overlook',
    description: 'A short cliff overlooks a small, fertile valley. You can see scores of Kobolds milling about doing whatever it is Kobolds do. A hole in the western rockface opens into a dark cave that reeks of Goblin.'
};

var westernOverlookUpdated = {
    areacode: 'KDV',
    roomnumber: 1,
    name: 'Western Overlook',
    description: 'A short cliff overlooks a small, fertile valley. You can see scores of Kobolds milling about doing whatever it is Kobolds do. A hole in the western rockface opens into a dark cave that reeks of Goblin.'
};

function RoomCode(areacode, roomnumber) {
    return 'RM:' + areacode + ':' + roomnumber;
}

function ExitCode(areacode, roomnumber) {
    if (roomnumber === null) return areacode + ':EX';
    else return RoomCode(areacode, roomnumber) + ':EX';
}

var errorObj404 = modeler.status.build(constants.status.ERROR, 'XXX', constants.error_messages.AREA_404, 'XXX');

describe('Room API', function() {
    beforeEach(function() {
        return client.flushallAsync()
            .then(function() {
                return Promise.all([
                    lib.area.async.createArea(koboldValleyArea.areacode, koboldValleyArea),
                    lib.area.async.createArea(goblinValleyArea.areacode, goblinValleyArea)
                ]);
            });
    });

    after(function() {
        return client.flushallAsync();
    });

    // POST
    describe('POST', function() {
        it('Create a room', function(done) {
            chai.request(server)
                .post('/api/room')
                .send(westernOverlook)
                .end(function(err, res) {
                    return lib.room.async.getRoom(westernOverlook.areacode, westernOverlook.roomnumber)
                        .then(function(room) {
                            expect(room).to.deep.equal(westernOverlook);
                            done();
                        })
                        .catch(function(err) {
                            done();
                            throw new Error(err);
                        });
                });
        });

        describe('Connecting...', function() {
            beforeEach(function() {
                return Promise.all([
                    lib.room.async.addRoom(westernOverlook.areacode, westernOverlook, true),
                    lib.room.async.addRoom(goblinCaveEntrance.areacode, goblinCaveEntrance, true)
                ]);
            });

            var wolExit = {
                source: westernOverlook,
                command: 'west'
            };

            var gcvExit = {
                source: goblinCaveEntrance,
                command: 'east'
            };

            it('...one room to another', function(done) {
                chai.request(server)
                    .post('/api/room/exit')
                    .send({ command: wolExit.command, source: wolExit.source, destination: gcvExit.source })
                    .end(function(err, res) {
                        lib.room.async.getRoom(westernOverlook.areacode, westernOverlook.roomnumber)
                            .then(function(room) {
                                expect(room.exits[wolExit.command]).to.equal(RoomCode(goblinCaveEntrance.areacode, goblinCaveEntrance.roomnumber));
                                done();
                            })
                            .catch(function(err) {
                                done();
                                throw new Error(err);
                            });
                    });
            });

            it('...two rooms to each other', function(done) {
                chai.request(server)
                    .post('/api/rooms/exits')
                    .send({ roomA: wolExit, roomB: gcvExit })
                    .end(function(err, res) {
                        Promise.all([
                                lib.room.async.getRoom(westernOverlook.areacode, westernOverlook.roomnumber),
                                lib.room.async.getRoom(goblinCaveEntrance.areacode, goblinCaveEntrance.roomnumber)
                            ])
                            .then(function(rooms) {
                                var overlook = rooms[0];
                                var entrance = rooms[1];

                                expect(overlook.exits).to.be.an('object');
                                expect(overlook.exits[wolExit.command]).to.equal('RM:' + goblinCaveEntrance.areacode + ':' + goblinCaveEntrance.roomnumber);

                                expect(entrance.exits).to.be.an('object');
                                expect(entrance.exits[gcvExit.command]).to.equal('RM:' + westernOverlook.areacode + ':' + westernOverlook.roomnumber);

                                done();
                            });
                    });
            });

        });
    });

    // GET
    describe('GET', function() {
        beforeEach(function() {
            return lib.room.async.addRoom(westernOverlook.areacode, westernOverlook);
        });
        /*
                it('Get rooms for an area', function() {
                    return new Promise(function(resolve, reject) {
                        chai.request(server)
                            .get('/api/rooms')
                            .end(function(err, res) {

                            });
                    });
                });
        */
        it('Get a room in an area', function(done) {
            chai.request(server)
                .get('/api/room/' + westernOverlook.areacode + '/' + westernOverlook.roomnumber)
                .end(function(err, res) {
                    expect(res.body).to.deep.equal(westernOverlook);
                    done();
                });
        });
    });

    // PUT
    describe('PUT', function() {
        beforeEach(function() {
            return lib.room.async.addRoom(westernOverlook.areacode, westernOverlook);
        });

        it('Update the description of the western overlook', function(done) {
            chai.request(server)
                .put('/api/room/' + westernOverlook.areacode + '/' + westernOverlook.roomnumber)
                .send(westernOverlookUpdate)
                .end(function(err, res) {
                    lib.room.async.getRoom(westernOverlook.areacode, westernOverlook.roomnumber)
                        .then(function(room) {
                            expect(room).to.deep.equal(westernOverlookUpdated);
                            done();
                        });
                });
        });
    });

    // DELETE
    describe('DELETE', function() {
        beforeEach(function() {
            return lib.room.async.addRoom(westernOverlook.areacode, westernOverlook);
        });

        it('Delete a room from an area', function(done) {
            chai.request(server)
                .del('/api/room/' + westernOverlook.areacode + '/' + westernOverlook.roomnumber)
                .end(function(err, res) {
                    lib.room.async.getRoom(westernOverlook.areacode, westernOverlook.roomnumber)
                        .then(function(room) {
                            expect(room).to.equal(null);
                            done();
                        });
                });
        });
    });
});