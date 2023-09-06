import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql
.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
})
.promise();

export async function getArtByID(id) {
    const [row] = await pool.query(
        `SELECT * FROM Articulo WHERE Num_Referencia = ?`, [id]
    )
    return row[0];
}

export async function getAllArtID() {
    const [row] = await pool.query(
        `SELECT * FROM Articulo`
    )
    return row;
}

getArtByID(1);