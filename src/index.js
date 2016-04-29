'use strict';

const Path = require('path');
const Fs = require('fs');

class NeoTestDBPrivate {

    deleteFolderRecursive(dirName) {

        dirName = Path.resolve(dirName);
        const safePath = Path.resolve(__dirname, '../');
        if (dirName.indexOf(safePath) === -1) {
            throw new Error(`trying to delete outside safe path ${safePath}`);
        }
        if (Fs.existsSync(dirName)) {
            Fs.readdirSync(dirName).forEach((file) => {

                const curPath = dirName + '/' + file;
                if (Fs.lstatSync(curPath).isDirectory()) { // recurse
                    this.deleteFolderRecursive(curPath);
                }
                else { // delete file
                    Fs.unlinkSync(curPath);
                }
            });
            Fs.rmdirSync(dirName);
        }
    }

    readFile(location) {

        return Fs.readFileSync(location).toString();
    }

    getServerPopertiesLocation() {

        return this.getServerLocation() + '/conf/neo4j-server.properties';
    }

    getServerBin() {

        return this.getServerLocation() + '/bin/neo4j';
    }

    getServerLocation() {

        return Path.resolve(__dirname, `../bin/neo4j-community-${this.version}`);
    }

    escapeRegExp(str) {

        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
    }

    setProperty(name, value) {

        const location = this.getServerPopertiesLocation();
        const regex = new RegExp(`${this.escapeRegExp(name)}=.*`);
        let properties = this.readFile(location);
        properties = properties.replace(regex, `${name}=${value}`);
        Fs.writeFileSync(location, properties);
    }

    start() {

        return new Promise((resolve) => {

            this.resolve = resolve;
            this.cleanup();
            this.instance = require('child_process').spawn(this.getServerBin(), ['console']);
            this.instance.on('close', this.instanceClosed.bind(this));
            this.instance.stdout.on('data', this.instanceData.bind(this));
            this.instance.stderr.on('data', this.instanceError.bind(this));
            this.instance.stdin.end();
            process.on('exit', this.stop.bind(this));
        });

    }

    getDBLocation() {

        return `data/graph.db.${this.port}`;
    }

    cleanup() {

        this.deleteFolderRecursive(this.getServerLocation() + '/' + this.getDBLocation());
    }

    stop() {

        return new Promise((resolve) => {

            this.resolve = resolve;
            this.instance.kill('SIGHUP');
        });
    }

    instanceError(message) {

        message = message.toString();
        throw message;
    }

    instanceData(message) {

        message = message.toString();
        if (message.indexOf(' ERROR ') !== -1) {
            throw message;
        }
        const data = { pid: this.instance.pid, port: this.port, url: this.getURL() };
        if (message.indexOf('Remote interface ready and available') !== -1) {
            this.resolve(data);
        }
        if (message.indexOf('Successfully shutdown database') !== -1) {
            this.resolve(data);
        }
    }

    instanceClosed() {

        this.cleanup();
    }

}

class NeoTestBD extends NeoTestDBPrivate {

    constructor(port, version) {

        super();
        if (version === undefined) {
            version = '2.3.1';
        }
        if (port === undefined) {
            throw new Error('NeoTestBD port is required');
        }
        this.setVersion(version);
        this.setProperty('org.neo4j.server.webserver.https.enabled', 'false');
        this.setPort(port);
    }

    setVersion(version) {

        this.version = version;
    }

    setPort(port) {

        this.port = port || 6363;
        this.setProperty('org.neo4j.server.webserver.port', port);
        this.setProperty('org.neo4j.server.database.location', this.getDBLocation());

    }

    getURL() {

        return `http://localhost:${this.port}`;
    }

    start() {

        return super.start();
    }

    stop() {

        return super.stop();
    }
}


module.exports = NeoTestBD;
