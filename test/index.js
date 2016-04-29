'use strict';

const Lab = require('lab');
const lab = exports.lab = Lab.script();
const Co = require('co');

const it = lab.it;
const describe = lab.describe;

const NeoTestDB = require('../src');


describe('2.3.1', () => {

    const db = new NeoTestDB(6363, '2.3.1');
    it('should start a temporary db 2.3.1', () => {

        return Co(function*() {

            const dbInfo = yield db.start();
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
        });
    });

    it('should stop a temporary db 2.3.3', () => {

        return Co(function*() {

            yield db.stop();
        });
    });

});
