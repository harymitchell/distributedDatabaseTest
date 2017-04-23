var pg = require('pg');
 
// create a config to configure both pooling behavior 
// and client options 
var configA = {
    user: 'northwind_user', //env var: PGUSER 
    database: 'northwind', //env var: PGDATABASE 
    password: 'thewindisblowing', //env var: PGPASSWORD 
    host: 'ec2-54-200-181-33.us-west-2.compute.amazonaws.com',//'localhost', // Server hosting the postgres database 
    port: '5432', //env var: PGPORT 
    max: 10, // max number of clients in the pool 
    idleTimeoutMillis: 3000000//30000, // how long a client is allowed to remain idle before being closed 
};
 
//this initializes a connection pool 
var poolA = new pg.Pool(configA);
 
// to run a query we can acquire a client from the pool, 
// run a query on the client, and then return the client to the pool 
poolA.connect(function(err, client, done) {
    console.log ("connected to poolA");
    if(err) {
        return console.error('error fetching client from pool', err);
    }
    var startTime = new Date();
    var list = [];
    var len = parseInt(process.env.NUM_QUERIES) || 100;
    for (var i = 0 ; i < len ; i++){
        queryForClient (queryForIndex(i, len), client, done, i, list, len, startTime);
    }
});
 
poolA.on('error', function (err, client) {
    // if an error is encountered by a client while it sits idle in the pool 
    console.error('idle client error', err.message, err.stack);
});

// create a config to configure both pooling behavior 
// and client options 
var configB = {
    user: 'northwind_user', //env var: PGUSER 
    database: 'northwind', //env var: PGDATABASE 
    password: 'thewindisblowing', //env var: PGPASSWORD 
    host: 'ec2-54-200-181-33.us-west-2.compute.amazonaws.com',//'localhost', // Server hosting the postgres database 
    port: '5432', //env var: PGPORT 
    max: 10, // max number of clients in the pool 
    idleTimeoutMillis: 3000000//30000, // how long a client is allowed to remain idle before being closed 
};
 
//this initializes a connection pool 
var poolB = new pg.Pool(configB);
 
// to run a query we can acquire a client from the pool, 
// run a query on the client, and then return the client to the pool 
poolB.connect(function(err, client, done) {
    console.log ("connected to poolB");
    if(err) {
        return console.error('error fetching client from pool', err);
    }
    var startTime = new Date();
    var list = [];
    var len = parseInt(process.env.NUM_QUERIES) || 100;
    for (var i = 0 ; i < len ; i++){
        queryForClient (queryForIndex(i, len), client, done, i, list, len, startTime);
    }
});
 
poolB.on('error', function (err, client) {
    // if an error is encountered by a client while it sits idle in the pool 
    console.error('idle client error', err.message, err.stack);
});

////////////////////////////////////////////////////////////////////////
// Helper functions

function queryForIndex(i, len){
    var n = i/len;
    if (n <= .45){
        return 'SELECT * FROM orders join order_details on order_details.orderid = orders.orderid join customers on customers.customerid = orders.customerid';
    } else if (n <= .85){
        return 'SELECT * from products join suppliers on suppliers.supplierid = products.supplierid';
    } else {
        return 'SELECT * from employees join employeeterritories on employeeterritories.employeeid = employees.employeeid';
    }
}

function queryForClient (query, client, done, i, list, len, startTime){
    client.query(query, function(err, result) {
        
        list.push (i);

        if (list.length === len){
            console.log ("Finished,", (new Date()).getTime() - startTime, "ms", len);
            process.exit();
        }
        
        //call `done(err)` to release the client back to the pool (or destroy it if there is an error) 
        done(err);
        
        if(err) {
            return console.error('error running query', err);
        }
        
        //output: 1 
    });
}