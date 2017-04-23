// Imports
var pg = require('pg');
var simpleSqlParser = require('simple-sql-parser');

/**
 * A simple Distributed Database Interface for a replicated database. This interface
 * assumes that all the databases from prodived in the pg_configs array can perform READ
 * operations on the data.
 * 
 * @param pg_configs is an Array of pg config objects, 
 *  with the added bool attribute readOnly to signal readOnly nodes.
 */
function DistributedDatabaseInterface(pg_configs){
    
    this.masterPools = [];
    this.readOnlyPools = [];
    this.allPools = [];
    
    /**
     * Initializes masterPools and readOnlyPools from given pg_configs
     */
    pg_configs.forEach(function(config){
        var pool = new pg.Pool(config);
        var _this = this;
        pool.connect(function(err, client, done) {
            if(err) {
                return console.error(config.host+': error fetching client from pool', err);
            }
            console.log (config.host+": connected to pool");
            var obj = {pool: pool, client: client, done: done, host: config.host};
            if (config.readOnly){
                _this.readOnlyPools.push(obj);
            } else {
                _this.masterPools.push (obj);   
            }
            _this.allPools.push(obj);
        });
        pool.on('error', function (err, client) {
            console.error(config.host+': idle client error', err.message, err.stack);
        });
    }, this);
    
    /**
     * Selects a DB client for the query by:
     *  1) parsing the query
     *  2) SELECT operations can be sent to any server
     *  3) otherwise, we send the query to a master node
     * 
     * Database selection occurs randomly within the set of applicable database.
     */
    this.executeQuery = function(query, callback){
        var poolObj;
        var ast = simpleSqlParser.sql2ast(query);
        if (ast.value.type == "select"){ 
            poolObj = this.allPools[ Math.floor(Math.random() * this.allPools.length) ];
        } else {
            // Query is not read-only
            poolObj = this.masterPools[ Math.floor(Math.random() * this.masterPools.length) ];
        }
        var poolHost = poolObj.host;
        poolObj.client.query(query, function(err, result) {
            //call `done(err)` to release the client back to the pool (or destroy it if there is an error) 
            poolObj.done(err);
            if (err) {
                return console.error('error running query', err);
            }
            console.log (poolHost+": query success");
            callback();
        });
    };
    
}

// Export DistributedDatabaseInterface as a node module.
if (typeof module != 'undefined') module.exports = DistributedDatabaseInterface;