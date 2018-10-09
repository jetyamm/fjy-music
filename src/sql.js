var mysql = require('mysql');
var pool  = mysql.createPool({
  connectionLimit : 10,
  host            : 'localhost',
  user            : 'root',
  password        : '',
  database        : 'wangyiyun'
});

var query = function (sql,options,callback) {
    pool.getConnection(function (err, connection) {
        if (err) throw err; // not connected!
        // Use the connection
        connection.query(sql, options,function (error, results, fields) {
            // When done with the connection, release it.
            connection.release();
            // Handle error after the release.
            if (error) throw error;
            // Don't use the connection here, it has been returned to the pool.
            //console.log(results);
            callback(results)
        });
    });
};
module.exports = {
    query: query
}