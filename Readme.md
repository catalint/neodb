[![Kalon.ro](http://kalon.ro/images/kalon-logo.svg)](http://kalon.ro) [![neo4j.com](http://neo4j.com/wp-content/themes/neo4jweb/assets/images/neo4j-logo-2015.png)](http://neo4j.com)   

NeoDB

Starts a local Neo4J DB


Usage

```js
"use strict"

let NeoTestBD = require('neodb')

let testDB = new NeoTestBD(6363)
testDB.start().then(function (data) {
    console.log('Started Neo4j Test DB', data)
}).catch(function (e) {
    console.log('err', e)
})
```





