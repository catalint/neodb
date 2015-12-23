"use strict"

let NeoTestBD = require('../src')

let testDB = new NeoTestBD(6363)
testDB.start().then(function (data) {
    console.log('Started Neo4j Test DB', data)
}).catch(function (e) {
    console.log('err', e)
})

setTimeout(function () {
    testDB.stop().then(function (data) {
        console.log('Stopped Neo4j Test DB', data)
    }).catch(function (e) {
        console.log('err', e)
    })
}, 10300)