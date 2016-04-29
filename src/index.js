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

    getServerPropertiesLocation() {

        let location;
        if (this.version === '3.0.0') {
            location = this.getServerLocation() + '/conf/neo4j.conf';
        }
        else {
            location = this.getServerLocation() + '/conf/neo4j-server.properties';
        }
        return location;
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

        const location = this.getServerPropertiesLocation();
        const regex = new RegExp(`${this.escapeRegExp(name)}=.*`);
        let properties = this.readFile(location);
        properties = properties.replace(`#${name}`, name);
        properties = properties.replace(`# ${name}`, name);
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

        if (this.version === '3.0.0') {
            this.deleteFolderRecursive(this.getServerLocation() + '/data/databases/' + this.getDBLocation());
        }
        else {
            this.deleteFolderRecursive(this.getServerLocation() + '/' + this.getDBLocation());
        }
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
        const data = { version: this.version, pid: this.instance.pid, port: this.port, url: this.getURL() };
        if (this.version === '3.0.0') {
            data.boltPort = this.boltPort;
            data.boltURL = this.getBoltURL();
        }
        if (message.indexOf('Remote interface ready and available') !== -1 || message.indexOf('Remote interface available') !== -1) {
            this.resolve(data);
        }
        if (message.indexOf('Successfully shutdown database') !== -1 || message.indexOf('Stopped.') !== -1) {
            this.resolve(data);
        }
    }

    instanceClosed() {

        this.cleanup();
    }

}

class NeoTestBD extends NeoTestDBPrivate {

    constructor(port, version, boltPort) {

        super();
        if (version === undefined) {
            version = '2.3.1';
        }
        if (port === undefined) {
            throw new Error('NeoTestBD port is required');
        }
        this.setVersion(version);
        if (this.version === '3.0.0') {
            this.setProperty('dbms.connector.https.enabled', 'false');
            this.setProperty('dbms.security.auth_enabled', 'false');
        }
        else {
            this.setProperty('org.neo4j.server.webserver.https.enabled', 'false');
        }

        this.setPort(port);
        this.setBoltPort(boltPort);
    }

    setVersion(version) {

        this.version = version;
    }

    setBoltPort(bolPort) {

        if (this.version === '3.0.0') {
            this.boltPort = bolPort || 6365;
            this.setProperty('dbms.connector.bolt.address', `127.0.0.1:${this.boltPort}`);
        }
    }

    setPort(port) {

        this.port = port || 6363;
        if (this.version === '3.0.0') {
            this.setProperty('dbms.connector.http.address', `127.0.0.1:${this.port}`);
            this.setProperty('dbms.active_database', this.getDBLocation());
        }
        else {
            this.setProperty('org.neo4j.server.webserver.port', this.port);
            this.setProperty('org.neo4j.server.database.location', this.getDBLocation());
        }

    }

    getBoltURL() {

        return `bolt://127.0.0.1:${this.boltPort}`;
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
