const sql = require('mysql');

const db = sql.createConnection({
       host: "localhost",
       user: 'root',
       password: "12345",
       database: "social"
});

module.exports = db;