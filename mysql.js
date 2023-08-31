var mysql = require('mysql');

var con = mysql.createPool({
    connectionLimit: 10,
    "user": 'root',
    "password": 'root',
    "database": 'ecommerce',
    "host": 'localhost',
    "port": 3306
})

module.exports = con;