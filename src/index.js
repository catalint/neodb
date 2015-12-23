"use strict"
let path = require('path')
let fs = require('fs')
class NeoTestDBPrivate {
    deleteFolderRecursive(dirnName) {
        dirnName = path.resolve(dirnName)
        let safePath = path.resolve(__dirname, '../')
        if (dirnName.indexOf(safePath) === -1) {
            throw new Error(`trying to delete outside safe path ${safePath}`)
        }
        if (fs.existsSync(dirnName)) {
            fs.readdirSync(dirnName).forEach((file, index) => {
                var curPath = dirnName + "/" + file;
                if (fs.lstatSync(curPath).isDirectory()) { // recurse
                    this.deleteFolderRecursive(curPath);
                } else { // delete file
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(dirnName);
        }
    }

    readFile(location) {
        return fs.readFileSync(location).toString()
    }

    getServerPopertiesLocation() {
        return this.getServerLocation() + '/conf/neo4j-server.properties'
    }

    getServerBin() {
        return this.getServerLocation() + '/bin/neo4j'
    }

    getServerLocation() {
        return path.resolve(__dirname, '../bin/neo4j-community-2.3.1')
    }

    escapeRegExp(str) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    }

    setProperty(name, value) {
        let location = this.getServerPopertiesLocation()
        let properties = this.readFile(location)
        let regex = new RegExp(`${this.escapeRegExp(name)}=.*`)
        properties = properties.replace(regex, `${name}=${value}`)
        fs.writeFileSync(location, properties)
    }

    start() {
        return new Promise((resolve, reject)=> {
            this.resolve = resolve
            this.cleanup()
            console.log(this.getServerBin())
            this.instance = require('child_process').spawn(this.getServerBin(), ['console'])
            this.instance.on('close', this.instanceClosed.bind(this))
            this.instance.stdout.on('data', this.instanceData.bind(this))
            this.instance.stderr.on('data', this.instanceError.bind(this));
            this.instance.stdin.end();
        })

    }

    getDBLocation() {
        return `data/graph.db.${this.port}`
    }

    cleanup() {
        this.deleteFolderRecursive(this.getServerLocation() + '/' + this.getDBLocation())
    }

    stop() {
        return new Promise((resolve, reject)=> {
            this.resolve = resolve
            this.instance.kill('SIGHUP')
        })
    }

    instanceError(message) {
        message = data.toString()
        //console.log(':!', message)
        throw message
    }

    instanceData(message) {
        message = message.toString()
        //console.log(':', message)
        if (message.indexOf(' ERROR ') !== -1) {
            throw message
        }
        if (message.indexOf("Remote interface ready and available") !== -1) {
            this.resolve({pid: this.instance.pid, port: this.port})
        }
        if (message.indexOf("Successfully shutdown database") !== -1) {
            this.resolve({pid: this.instance.pid, port: this.port})
        }
    }

    instanceClosed(code, signal) {
        this.cleanup()
    }

}

class NeoTestBD extends NeoTestDBPrivate {
    constructor(port) {
        super()
        if (port === undefined) {
            throw new Error("NeoTestBD port is required")
        }
        this.setProperty('org.neo4j.server.webserver.https.enabled', 'false')
        this.setPort(port)
    }

    setPort(port) {
        this.port = port || 6363
        this.setProperty('org.neo4j.server.webserver.port', port)
        this.setProperty('org.neo4j.server.database.location', this.getDBLocation())

    }

    getURL() {
        return `http://localhost:${this.port}`
    }

    start() {
        return super.start()
    }

    stop() {
        return super.stop()
    }
}


module.exports = NeoTestBD
