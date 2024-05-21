import {createPool} from "mysql2/promise"

const pool = createPool((
    host: "localhost",
    port: "8080",
    user: "prueba01",
    password: "prueba01",
    database: "prueba01"
));

export default pool;
