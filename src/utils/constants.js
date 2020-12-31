exports.Package = require('../../package.json');

/**
 * Options for a client.
 * @typedef {Object} ClientOptions
 * @property {boolean} [Debug=false] Starts in debug mode if activated
 * @property {boolean} [AutoReconnect=true] Automaticly try to reconnect to the database
 * @property {integer} [MaxReconnectTries=0] Number of reconnect tries until fatal error. (0 To infinity)
 */
exports.DefaultOptions = {
    Debug: false,
    AutoReconnect: true,
    MaxReconnectTries: 0,
};

exports.Errors = {
    
};

exports.Events = {
    
};
