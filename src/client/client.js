const EventEmmiter = require('events');
const {Util, Constants, Logger} = require('../utils');
const mysql = require('mysql');
const Commands = require('../Commands/Commands');
/**
 * Creates de main class to generate clients.
 */
class Client extends EventEmmiter {
    /**
     * @type {ClientOptions} TODO
     */
    constructor(Options = {}) {
        super();
        /**
         * The options the client was instantiated with
         * @type {ClientOptions}
         */
        this.Options = Util.MergeDefault(Constants.DefaultOptions, Options);
        this._ValidateOptions();

        if (this.Options.Debug === true) {
            Logger.ActiveDebug();
            Logger.Debug('Debug is active!');
        }

        this.MysqlConnection;
        this.Connected = false;


        this.on('MysqlConnectionStabilized', (Data) => {
            this.MysqlConnection = Data.MysqlConnection;
            this.Connected = true;
            this.emit('Ready');
        });
    }

    isConnected() {
        return this.Connected;
    }

    Connect(Host, User, Password, Database) {
        return new Promise((resolve, reject) => {
            var ConnectionTries = 1;
            Logger.Debug('Trying to connect to database');
            var LastError = '';
            function Connect(that) {
                var MysqlConnection = mysql.createConnection({
                    host: Host,
                    user: User,
                    password: Password,
                    database: Database,
                });
                if (that.Options.MaxReconnectTries > 0 && ConnectionTries > that.Options.MaxReconnectTries) {
                    reject('Couldn\'t connect to the database. Number of tries: ' + (ConnectionTries - 1) + '\nLast error:\n' + LastError);
                }
                Logger.Debug('Connection attempt: ' + ConnectionTries);
                MysqlConnection.connect(function(err) {
                    if (err) {
                        Logger.Debug('Connection failed!');
                        ConnectionTries += 1;
                        LastError = err;
                        Connect(that);
                        return;
                    }
                    Logger.Debug('Connected with ' + Host + ':3306 | Username: ' + User + ', on database: ' + Database);
                    that.emit('MysqlConnectionStabilized', {
                        MysqlConnection: MysqlConnection,
                        Tries: ConnectionTries,
                        Host: Host,
                        User: User,
                        Password: Password, // Not quite sure it should be saved on client
                        Database: Database
                    });
                    resolve();
                });
            }
            Connect(this);
        });
    }

    Get(SearchString) {
        return new Promise((resolve, reject) => {
            if (this.isConnected()) {
                Commands.Get(resolve, reject, this, SearchString);
            } else {
                this.on('Ready', () => {
                    resolve(this.Get(SearchString));
                });
            }
        });
    }

    CreateDataBase(DatabaseName) {
        return new Promise((resolve, reject) => {
            if (this.isConnected()) {
                Commands.CreateDataBase(resolve, reject, this, DatabaseName);
            } else {
                this.on('Ready', () => {
                    resolve(this.CreateDataBase(DatabaseName));
                });
            }
        });
    }

    GetDatabases() {
        return new Promise((resolve, reject) => {
            if (this.isConnected()) {
                Commands.GetDatabases(resolve, reject, this);
            } else {
                this.on('Ready', () => {
                    resolve(this.GetDatabases());
                });
            }
        });
    }

    SwitchTo(DatabaseName) {
        return new Promise((resolve, reject) => {
            if (this.isConnected()) {
                Commands.SwitchTo(resolve, reject, this, DatabaseName);
            } else {
                this.on('Ready', () => {
                    resolve(this.SwitchTo(DatabaseName));
                });
            }
        });
    }

    GetTables() {
        return new Promise((resolve, reject) => {
            if (this.isConnected()) {
                Commands.GetTables(resolve, reject, this);
            } else {
                this.on('Ready', () => {
                    resolve(this.GetTables());
                });
            }
        });
    }

    DeleteDatabase(DatabaseName) {
        return new Promise((resolve, reject) => {
            if (this.isConnected()) {
                Commands.DeleteDatabase(resolve, reject, this, DatabaseName);
            } else {
                this.on('Ready', () => {
                    resolve(this.DeleteDatabase(DatabaseName));
                });
            }
        });
    }

    DeleteTable(TableName) {
        return new Promise((resolve, reject) => {
            if (this.isConnected()) {
                Commands.DeleteTable(resolve, reject, this, TableName);
            } else {
                this.on('Ready', () => {
                    resolve(this.DeleteTable(TableName));
                });
            }
        });
    }

    Query(QueryString) {
        return new Promise((resolve, reject) => {
            if (this.isConnected()) {
                Commands.Query(resolve, reject, this, QueryString);
            } else {
                this.on('Ready', () => {
                    resolve(this.Query(QueryString));
                });
            }
        });
    }

    Add(TableName, ...Values) {
        return new Promise((resolve, reject) => {
            if (this.isConnected()) {
                if (typeof Values[0] === 'object') {
                    Values = Values[0];
                }
                Commands.Add(resolve, reject, this, TableName, Values);
            } else {
                this.on('Ready', () => {
                    resolve(this.Add(TableName, Values));
                });
            }
        });
    }

    _ValidateOptions(Options = this.Options) {
        if (typeof Options.Debug !== 'boolean') {
            throw new TypeError('Debug value must be a boolean!');
        }
        if (typeof Options.MaxReconnectTries !== 'number') {
            throw new TypeError('MaxReconnectTries value must be a number!');
        }
    }
}

module.exports = Client;