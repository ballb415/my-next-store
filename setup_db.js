const mariadb = require('mariadb');
const fs = require('fs');
const path = require('path');

async function setupDB() {
  try {
    const conn = await mariadb.createConnection({
      host: '127.0.0.1',
      port: 3306,
      user: 'root',
      password: '1234',
      multipleStatements: true
    });
    console.log("Connected to MariaDB with password=1234!");
    
    await conn.query("CREATE DATABASE IF NOT EXISTS mq_demo;");
    await conn.query("USE mq_demo;");
    
    const sqlFile = fs.readFileSync(path.join(__dirname, 'mq_sql_demo.sql'), 'utf8');
    await conn.query(sqlFile);
    console.log("Database mq_demo & tables imported successfully!");
    
    await conn.end();
  } catch (err) {
    console.error("SETUP ERROR:", err);
  }
}

setupDB();
