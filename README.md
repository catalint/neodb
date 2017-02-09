[![npm](https://img.shields.io/npm/v/neodb.svg)](https://www.npmjs.com/package/neodb) [![node](https://img.shields.io/node/v/neodb.svg)]()

What does this do?
=======================================
Creates a temporary neo4j db listening on `http://localhost:port`


Why do you I need it?
-----------------
It's here if you want to test nodejs neo4j integrations


Neo4j setup
----------
This module includes binaries to start neo4j, you’ll only need Java installed on your computer.

Usually you already have Java installed, if not we recommend that you install [OpenJDK 8 (preferred) or 7](http://openjdk.java.net/) or [Oracle Java 8 (preferred) or 7](http://www.oracle.com/technetwork/java/javase/downloads/index.html)

Supported neo4j versions
----
- 2.3.3
- 3.1.1 with new bolt connection

Supported OS
----------
osx, linux

Install
----------
`npm install --save-dev neodb`

Usage
----------
```js
"use strict"

let NeoTestDB = require('neodb')

let testDB = new NeoTestDB(6363, '2.3.3') // port, version, boltPort

testDB.start()
    .then(function (data) {
        console.log('Started Neo4j Test DB', data)
        setTimeout(function () {
            testDB.stop()
                .then(function (data) {
                    console.log('Stopped Neo4j Test DB', data)
                })
                .catch(function (e) {
                    console.error(e)
                })
        }, 2000)
    })
    .catch(function (e) {
        console.error(e)
    })
```

It always starts with an empty database.

when calling `.start()` you will get an Promise object that when resolved will have the following keys
- `version`, running Neo4j version ex. 2.3.3
- `port`, http port ex. 6363
- `url`, http url ex. http://localhost:6363
- `boltPort`, bolt port ex. 6364
- `boltURL`, bolt url ex. bolt://127.0.0.1:6364

Learn more
----------

* Neo4j Home: [http://neo4j.com/](http://neo4j.com/)
