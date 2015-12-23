[![npm](https://img.shields.io/npm/v/neodb.svg)](https://www.npmjs.com/package/neodb)

[![neo4j.com](http://neo4j.com/wp-content/themes/neo4jweb/assets/images/neo4j-logo-2015.png)](http://neo4j.com) [![Kalon.ro](http://kalon.ro/images/kalon-logo.svg)](http://kalon.ro)

What does this do?
=======================================
Creates a temporary neo4j db listening on `http://localhost:port` via simple calls from within apps using node.js >= 4

Neo4j 2.3.1
----------
This module includes binaries to start neo4j, you’ll need a Java Virtual Machine installed on your computer.

Usually you already have Java installed, if not we recommend that you install [OpenJDK 8 (preferred) or 7](http://openjdk.java.net/) or [Oracle Java 8 (preferred) or 7](http://www.oracle.com/technetwork/java/javase/downloads/index.html)

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

let NeoTestBD = require('neodb')

let testDB = new NeoTestBD(6363)

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

It always starts with an empty database , all data is lost when closing.

Learn more
----------

* Neo4j Home: http://neo4j.com/