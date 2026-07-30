const mariadb = require('mariadb');

async function testConnection(user, password) {
  try {
    const conn = await mariadb.createConnection({
      host: '127.0.0.1',
      port: 3306,
      user: user,
      password: password,
      database: 'mq_demo'
    });
    console.log(`SUCCESS WITH user=${user}, password=${password}`);
    const rows = await conn.query("SELECT * FROM user");
    console.log("Users in DB:", rows);
    await conn.end();
    return true;
  } catch (err) {
    console.log(`FAILED WITH user=${user}, password=${password}:`, err.message);
    return false;
  }
}

async function run() {
  const passwords = ['', 'root', '123456', '1234', 'password', 'admin'];
  for (const pw of passwords) {
    if (await testConnection('root', pw)) break;
  }
}

run();
