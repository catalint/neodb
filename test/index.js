'use strict';

const Lab = require('lab');
const lab = exports.lab = Lab.script();
const Co = require('co');
const Code = require('code');

const it = lab.it;
const describe = lab.describe;
const expect = Code.expect;

const NeoTestDB = require('../src');


describe('default', () => {

    const db = new NeoTestDB(6363);
    it('should start a temporary db default', () => {

        return Co(function*() {

            const dbInfo = yield db.start();

            expect(dbInfo.version).to.be.equal('2.3.1');
            expect(dbInfo.port).to.be.equal(6363);
            expect(dbInfo.url).to.be.equal('http://localhost:6363');
        });
    });

    it('should stop a temporary db default', () => {

        return Co(function*() {

            yield db.stop();
        });
    });

});


describe('2.3.1', () => {

    const db = new NeoTestDB(6363, '2.3.1');
    it('should start a temporary db 2.3.1', () => {

        return Co(function*() {

            const dbInfo = yield db.start();

            expect(dbInfo.version).to.be.equal('2.3.1');
            expect(dbInfo.port).to.be.equal(6363);
            expect(dbInfo.url).to.be.equal('http://localhost:6363');
        });
    });

    it('should stop a temporary db 2.3.1', () => {

        return Co(function*() {

            yield db.stop();
        });
    });

});

describe('2.3.3', () => {

    const db = new NeoTestDB(6363, '2.3.3');
    it('should start a temporary db 2.3.3', () => {

        return Co(function*() {

            const dbInfo = yield db.start();

            expect(dbInfo.version).to.be.equal('2.3.3');
            expect(dbInfo.port).to.be.equal(6363);
            expect(dbInfo.url).to.be.equal('http://localhost:6363');
        });
    });

    it('should stop a temporary db 2.3.3', () => {

        return Co(function*() {

            yield db.stop();
        });
    });

});

describe('3.0.0', () => {

    const db = new NeoTestDB(6363, '3.0.0', 6364);
    it('should start a temporary db 3.0.0', () => {

        return Co(function*() {

            const dbInfo = yield db.start();

            expect(dbInfo.version).to.be.equal('3.0.0');
            expect(dbInfo.port).to.be.equal(6363);
            expect(dbInfo.url).to.be.equal('http://localhost:6363');

            expect(dbInfo.boltPort).to.be.equal(6364);
            expect(dbInfo.boltURL).to.be.equal('bolt://localhost:6364');
        });
    });

    it('should stop a temporary db 3.0.0', () => {

        return Co(function*() {

            yield db.stop();
        });
    });

});
