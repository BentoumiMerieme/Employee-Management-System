import mysql from 'mysql';

const pool = mysql.createPool({
  connectionLimit: 10, // Adjust the limit as per your needs
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'employeems'
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error('Database connection failed: ' + err.message);
  } else {
    console.log('Connected to the database');
    connection.release();
  }
});

export default pool;
