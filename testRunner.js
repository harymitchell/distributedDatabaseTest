// Imports 
var DistributedDatabaseInterface = require('./distributedDbInterface');

/**
 * A test runner for DistributedDatabaseInterface.
 * 
 * Config object: 
 *  
    {
        pg_configs:  [ pg_configA, pg_configB, etc ],
        n: Integer for number of queries to be run
    }
 */
function DistributedDatabaseTestRunner(config){
    this.pg_configs = config.pg_configs;
    this.n = config.n;
    this.distributedDatabaseInterface = new DistributedDatabaseInterface(this.pg_configs);
    this.start;
    this.end;
    
    /**
     * Starts the test. 
     */
    this.run = function(){
        this.incrementor = 0;
        this.runWhenPoolsInitialized(0);
    };
    
    /**
     * Checks that the distributedDatabaseInterface pools are initialized,
     * recursively using a setTimeout.  When initialized, call onPoolsInitialized().
     */
    this.runWhenPoolsInitialized = function (retries){
        var _this = this;
        if (this.distributedDatabaseInterface.allPools.length == configs.length){
            this.onPoolsInitialized();
        } else if (retries > 20){
            console.error("Maximum retries for runWhenPoolsInitialized");
            process.exit();
        } else{
            setTimeout(function(){_this.runWhenPoolsInitialized(retries++)}, 1000);
        }
    };
    
    /**
     * Sets up issuing N queries to distributedDatabaseInterface
     */
    this.onPoolsInitialized = function(){
        var _this = this;
        this.start = (new Date()).getTime();
        var i;
        for (i = 1; i <= this.n; i++){
            this.distributedDatabaseInterface.executeQuery(queryForIndex(i,this.n), function(){_this.queryCallback(_this)});
        }
    };
    
    /**
     * 
     */
    this.queryCallback = function(_this){
        _this.incrementor++;
        if (_this.incrementor >= _this.n){
            _this.end = (new Date()).getTime();
            console.log ("Finished in", _this.end - _this.start, " ms");
            process.exit();
        }
    };
    
    /**
     * 
     */
    // function pollForCompletion(){
        
    // }
    
    /**
     * Returns a query for the given index and len.
     */
    function queryForIndex(i, len){
        var n = i/len;
        if (n <= .25){
            return 'SELECT * FROM orders join order_details on order_details.orderid = orders.orderid join customers on customers.customerid = orders.customerid';
        } else if (n <= .5){
            return 'SELECT * from products join suppliers on suppliers.supplierid = products.supplierid';
        } else if (n <= .74){
            return "SELECT * FROM Shippers";
            // return "INSERT INTO employees VALUES ("+(i*100)+", 'TestInsert', 'TestInsert', 'TestInsert', 'Mr.', '1989-06-21', '1992-05-01', '507 - 20th Ave. E.Apt. 2A', 'Seattle', 'WA', '98122', 'USA', '(206) 555-9857', '5467', '\\x', 'Education includes a MS in CS in progress at GSU.', 2, 'http://accweb/emmployees/davolio.bmp')";
        } else {
            return "SELECT * FROM Shippers";
        }
    }
}


////////////////////////////////////////////////////////////////////////
// Main function
// @arg 1 n number of loops
// @arg 2 env [a, b, c, d]
if (typeof require === 'undefined' || require.main === module) {
    var BOX1 = 'localhost';//'ec2-54-201-245-57.us-west-2.compute.amazonaws.com';
    var BOX2 = 'ec2-54-200-181-33.us-west-2.compute.amazonaws.com';
    var BOX3 = 'ec2-54-187-146-174.us-west-2.compute.amazonaws.com';
    var BOX4 = 'ec2-54-202-221-86.us-west-2.compute.amazonaws.com';
    var BOX_CITUS= 'ec2-54-213-81-233.us-west-2.compute.amazonaws.com';
    var ENVS = ['a', 'b', 'c', 'd'];
    var N = parseInt(process.argv[2]);
    var ENV = process.argv[3];
    if (N <= 0 || Number.isNaN(N)){
        return console.error("First arg should the number of loops.");
    } 
    if (ENVS.indexOf(ENV) == -1){
        return console.error("Second arg should the ENV: a,b,c,or d.");
    }
    console.log ("Starting runner for ",process.argv[2],"loops, and ENV ",process.argv[3]);
    
    var configBox1 = {
        readOnly: false,
        user: 'northwind_user', //env var: PGUSER 
        database: 'northwind', //env var: PGDATABASE 
        password: 'thewindisblowing', //env var: PGPASSWORD 
        host: BOX1, 
        port: '5432', //env var: PGPORT 
        max: 10, // max number of clients in the pool 
        idleTimeoutMillis: 3000000//30000, // how long a client is allowed to remain idle before being closed 
    };
    
    var configBox2 = {
        readOnly: false,
        user: 'northwind_user', //env var: PGUSER 
        database: 'northwind', //env var: PGDATABASE 
        password: 'thewindisblowing', //env var: PGPASSWORD 
        host: BOX2, 
        port: '5432', //env var: PGPORT 
        max: 10, // max number of clients in the pool 
        idleTimeoutMillis: 3000000//30000, // how long a client is allowed to remain idle before being closed 
    };
    
    var configBox3 = {
        readOnly: false,
        user: 'northwind_user', //env var: PGUSER 
        database: 'northwind', //env var: PGDATABASE 
        password: 'thewindisblowing', //env var: PGPASSWORD 
        host: BOX3, 
        port: '5432', //env var: PGPORT 
        max: 10, // max number of clients in the pool 
        idleTimeoutMillis: 3000000//30000, // how long a client is allowed to remain idle before being closed 
    };
        
    var configBox4 = {
        readOnly: true,
        user: 'northwind_user', //env var: PGUSER 
        database: 'northwind', //env var: PGDATABASE 
        password: 'thewindisblowing', //env var: PGPASSWORD 
        host: BOX4, 
        port: '5432', //env var: PGPORT 
        max: 10, // max number of clients in the pool 
        idleTimeoutMillis: 3000000//30000, // how long a client is allowed to remain idle before being closed 
    };
    
    var configBoxCitus = {
        readOnly: true,
        user: 'northwind_user', //env var: PGUSER 
        database: 'northwind', //env var: PGDATABASE 
        password: 'thewindisblowing', //env var: PGPASSWORD 
        host: BOX_CITUS, 
        port: '5432', //env var: PGPORT 
        max: 10, // max number of clients in the pool 
        idleTimeoutMillis: 3000000//30000, // how long a client is allowed to remain idle before being closed 
    };
    var configs = [];
    if (ENV === 'a'){
        configs.push(configBox1);
    } else if (ENV === 'b'){
        configs.push(configBox2);
    } else if (ENV === 'c'){
        configs.push(configBox3);
        configs.push(configBox4);
    } else if (ENV === 'd'){
        configs.push(configBoxCitus);
    } else {
        return console.error("Unsupported ENV",ENV);
    }
    var config = {
        pg_configs:  configs,
        n: process.argv[2]
    };
    var runner = new DistributedDatabaseTestRunner(config);
    runner.run();
}