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

function CreateDataBase(resolve, reject, that, DataBaseName) {
    that.MysqlConnection.query('create database ' + DataBaseName + ';', (err, result)=>{
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

function SwitchTo(resolve, reject, that, DatabaseName) {
    that.MysqlConnection.query('use ' + DatabaseName + ';', (err, results)=>{
        if (err) reject(err);
        resolve(results);
    });
}

function GetTables(resolve, reject, that) {
    var ResultObject = [];
    that.MysqlConnection.query('show tables;', (err, results)=>{
        if (err) reject(err);
        results.forEach(element => {
            Object.values(element).forEach((key) => {
                ResultObject.push(key);
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

module.exports = {
    Get,
    CreateDataBase,
    GetDatabases,
    SwitchTo,
    GetTables,
    DeleteDatabase,
    DeleteTable,
    Query,
};