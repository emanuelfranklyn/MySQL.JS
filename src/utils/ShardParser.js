var client = null;

// https://www.geeksforgeeks.org/how-to-get-the-javascript-function-parameter-names-values-dynamically/
function getParams(func) { 
    var str = func.toString(); 
    str = str.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/(.)*/g, '').replace(/{[\s\S]*}/, '').replace(/=>/g, '').trim(); 
    var start = str.indexOf('(') + 1; 
    var end = str.length - 1; 
    var result = str.substring(start, end).split(', '); 
    var params = []; 
    result.forEach(element => { 
        element = element.replace(/=[\s\S]*/g, '').trim(); 
        if (element.length > 0) params.push(element); 
    }); 
    return params; 
} 
//

function DefineClient(Client) {
    client = Client;
    Object.getOwnPropertyNames(this).forEach((values) => {
        if (values !== 'DefineClient') {
            var Command = `this.${values} = (${getParams(this[values]).join(',')}) => {
                return SendCommandToIndex('${values}'${getParams(this[values]).join(',') === '' ? '' : ',' + getParams(this[values]).join(',')});
            };`;
            eval(Command);
        }
    });
}

function SendCommandToIndex(CommandName, ...args) {
    return new Promise((resolve, reject) => {
        var Id = Math.floor(Math.random() * 6000) + 1;
        if (typeof args[1] === 'object') {
            args[1] = args[1].join('\', \'');
        }
        CommandName = 'DataBase.' + CommandName + '(\'' + args.join('\', \'') + '\')';
        client.send({MasterEval: true, EvalCommand: CommandName, Id: Id});
        setTimeout(()=>{
            reject('No Response');
        }, 20000);
        function MessageParser(Content) {
            Content = JSON.parse(Content);
            if (Content.MasterEvalResponseId === Id) {
                process.removeListener('message', MessageParser);
                if (!Content.error) {
                    resolve(Content.Response);
                } else {
                    reject(JSON.parse(Content.error));
                }
            }
        }
        process.on('message', MessageParser);
    });
}

module.exports = {
    DefineClient: DefineClient,
    Add(TableName, ...Values) {
        return SendCommandToIndex('Add',TableName,Values);
    },
    CreateDataBase(DataBaseName, createifnotexists) {
        return SendCommandToIndex('CreateDataBase', DataBaseName, createifnotexists);
    },
    DeleteDatabase(DataBaseName) {
        return SendCommandToIndex('DeleteDatabase', DataBaseName);
    },
    DeleteTable(TableName) {
        return SendCommandToIndex('DeleteTable', TableName);
    },
    Get(SearchString) {
        return SendCommandToIndex('Get', SearchString);
    },
    GetDatabases() {
        return SendCommandToIndex('GetDatabases');
    },
    GetTables() {
        return SendCommandToIndex('GetTables');
    },
    Query(QueryString) {
        return SendCommandToIndex('Query', QueryString);
    },
    SwitchTo(DataBaseName, createifnotexists) {
        return SendCommandToIndex('SwitchTo', DataBaseName, createifnotexists);
    },
    isConnected() {
        return SendCommandToIndex('isConnected');
    },
};