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





