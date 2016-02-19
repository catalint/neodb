"use strict"

let NeoTestDB = require('../src')

let testDB = new NeoTestDB(6363)

testDB.start()
    .then(function (data) {
        console.log('Started Neo4j Test DB', data)
        setTimeout(function () {
            testDB.stop()
                .then(function (data) {
                    console.log('Stopped Neo4j Test DB', data)
                })
                .catch(function (err) {
                    throw err
                })
        }, 2000)
    })
    .catch(function (err) {
        throw err
    })
