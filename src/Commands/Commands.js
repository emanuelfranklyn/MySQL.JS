function Get(resolve, reject, that, SearchString) {
    var ResultObject = [];
    that.MysqlConnection.query('SELECT * FROM ' + SearchString + ';', (err, results)=>{
        if (err) reject(err);
        results.forEach(element => {
            var ConvertingRawDataPacket = {};
            Object.keys(element).forEach((key, index) => {
                ConvertingRawDataPacket[key] = Object.values(element)[index];
            });
            ResultObject.push(ConvertingRawDataPacket);
        });
        resolve(ResultObject);
    });
}

function CreateDataBase(resolve, reject, that, DataBaseName, createifnotexists) {
    if (createifnotexists !== false) {createifnotexists = true;}
    that.MysqlConnection.query('CREATE DATABASE ' + (createifnotexists ? 'IF NOT EXISTS' : '') + DataBaseName + ';', (err, result)=>{
        if (err) reject(err);
        resolve(result);
    });
}

function GetDatabases(resolve, reject, that) {
    var ResultObject = [];
    that.MysqlConnection.query('show databases;', (err, results)=>{
        if (err) reject(err);
        results.forEach(element => {
            Object.values(element).forEach((key) => {
                ResultObject.push(key);
            });
        });
        resolve(ResultObject);
    });
}

function SwitchTo(resolve, reject, that, DatabaseName, createifnotexists) {
    if (createifnotexists) { 
        that.MysqlConnection.query('CREATE DATABASE IF NOT EXISTS ' + DatabaseName + ';', (err)=>{
            if (err) reject(err);
        });
    }
    that.MysqlConnection.query('use ' + DatabaseName + ';', (err, results)=>{
        if (err) reject(err);
        resolve(results);
    });
}

function GetTables(resolve, reject, that) {
    var ResultObject = {};
    that.MysqlConnection.query('show tables;', (err, results)=>{
        if (err) reject(err);
        results.forEach(element => {
            Object.values(element).forEach((key) => {
                ResultObject[key] = {
                    Add: (...values) => {
                        that.Add(key, values);
                    },
                };
            });
        });
        resolve(ResultObject);
    });
}

function DeleteDatabase(resolve, reject, that, DatabaseName) {
    that.MysqlConnection.query('drop database ' + DatabaseName + ';', (err, results)=>{
        if (err) reject(err);
        resolve(results);
    });
}

function DeleteTable (resolve, reject, that, TableName) {
    that.MysqlConnection.query('drop table ' + TableName + ';', (err, results)=>{
        if (err) reject(err);
        resolve(results);
    });
}

function Query(resolve, reject, that, Query) {
    if (Query.substring(Query.length - 1) !== ';') {Query += ';';}
    that.MysqlConnection.query(Query, (err, results)=>{
        if (err) reject(err);
        resolve(results);
    });
}

function Add(resolve, reject, that, TableName, values) {
    that.MysqlConnection.query('describe ' + TableName + ';', (err, results)=>{
        if (err) reject(err);
        var ValuesNames = [];
        results.forEach((element) => {
            if (element.Extra !== 'auto_increment') {
                ValuesNames.push(element.Field);
            }
        });
        that.MysqlConnection.query('INSERT INTO ' + TableName + ' (' + ValuesNames.join(',') + ') VALUES (\'' + values.join('\', \'') + '\');', (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
}

module.exports = {
    Get,
    CreateDataBase,
    GetDatabases,
    SwitchTo,
    GetTables,
    DeleteDatabase,
    DeleteTable,
    Query,
    Add,
};