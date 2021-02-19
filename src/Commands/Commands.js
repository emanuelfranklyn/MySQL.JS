const mysql = require('mysql');

function Get(resolve, reject, that, SearchString) {
    var ResultObject = [];
    that.MysqlConnection.query('SELECT * FROM ' + mysql.escapeId(SearchString) + ';', (err, results)=>{
        if (err) reject(err);
        if (typeof results !== 'object') reject('No content'); 
        try {
            results.forEach(element => {
                var ConvertingRawDataPacket = {};
                Object.keys(element).forEach((key, index) => {
                    ConvertingRawDataPacket[key] = Object.values(element)[index];
                });
                ResultObject.push(ConvertingRawDataPacket);
            });
        } catch (e) {
            reject(e);
        }
        resolve(ResultObject);
    });
}

function CreateDataBase(resolve, reject, that, DataBaseName, createifnotexists) {
    if (createifnotexists !== false) {createifnotexists = true;}
    that.MysqlConnection.query('CREATE DATABASE ' + (createifnotexists ? 'IF NOT EXISTS' : '') + mysql.escapeId(DataBaseName) + ';', (err, result)=>{
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
        that.MysqlConnection.query('CREATE DATABASE IF NOT EXISTS ' + mysql.escapeId(DatabaseName) + ';', (err)=>{
            if (err) reject(err);
        });
    }
    that.MysqlConnection.query('use ' + mysql.escapeId(DatabaseName) + ';', (err, results)=>{
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
    that.MysqlConnection.query('drop database ' + mysql.escapeId(DatabaseName) + ';', (err, results)=>{
        if (err) reject(err);
        resolve(results);
    });
}

function DeleteTable (resolve, reject, that, TableName) {
    that.MysqlConnection.query('drop table ' + mysql.escapeId(TableName) + ';', (err, results)=>{
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

    that.MysqlConnection.query('describe ' + mysql.escapeId(TableName) + ';', async (err, results)=>{
        if (err) reject(err);
        var ValuesNames = [];
        var IndexValue;
        await results.forEach((element) => {
            if (element.Extra !== 'auto_increment') {
                ValuesNames.push(element.Field);
            } else {
                IndexValue = element.Field;
            }
        });
        var ValueAlreadExists = false;
        var ValueIndex = -1;
        that.MysqlConnection.query('SELECT * FROM ' + mysql.escapeId(TableName) + ';', async (err, results) => {
            await results.forEach((Content, Cindex) => {
                ValuesNames.forEach((ValueN, index) => {
                    if (Content[ValueN] === values[index]) {
                        ValueAlreadExists = true;
                        ValueIndex = Cindex;
                    }
                });
            });
            if (ValueAlreadExists) {
                var ContentString = '';
                await ValuesNames.forEach((ValueN, index) => {
                    if (index === ValuesNames.length - 1) {
                        ContentString += ValueN + '="' + values[index] + '"';
                    } else {
                        ContentString += ValueN + '="' + values[index] + '",';
                    }
                });
                if (!IndexValue) {
                    // eslint-disable-next-line max-len
                    console.log('Couldn\'t add value because it already exists and the table doesn\'t contains a auto_increment value so it cannot update the value!');
                } else {
                    ValueIndex++;
                    // eslint-disable-next-line max-len
                    that.MysqlConnection.query('UPDATE ' + mysql.escapeId(TableName) + ' SET ' + mysql.escapeId(ContentString) + ' WHERE ' + mysql.escapeId(IndexValue) + '=' + mysql.escape(ValueIndex) + ';', (err, results) => {
                        if (err) reject(err);
                        resolve(results);
                    });
                }
            } else {
                // eslint-disable-next-line max-len
                that.MysqlConnection.query('INSERT INTO ' + mysql.escapeId(TableName) + ' (' + mysql.escapeId(ValuesNames.join(',')) + ') VALUES (\'' + mysql.escape(values.join('\', \'')) + '\');', (err, results) => {
                    if (err) reject(err);
                    resolve(results);
                });
            }
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