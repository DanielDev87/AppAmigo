import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('appamigo.db');

const init = ()=>{
    db.execSync(
        `CREATE TABLE IF NOT EXISTS user_academic (
            id TEXT PRIMARY KEY NOT NULL,
            direccion TEXT,
            correo TEXT,
            facultad TEXT,
            programa TEXT,
            otros TEXT
        );`
    );
};

const upsertAcademic = (id, {direccion = null, correo = null, programa = null, otros = null}={})=>{
    const result = db.runSync(
       `INSERT OR REPLACE INTO user_academic (id, direccion, correo, facultad, programa, otros)
       VALUES (?,?,?,?,?,?);`,
       [id, direccion, correo, facultad, programa, otros] 
    );
    return result;
};

const getAcademicById = (id) => {
    const row = db.getFirstSync(
        `SELECT * FROM user_academic WHERE id = ?;`,[id]
    );
    return row || null;
}

const deleteAcademicById = (id) => {
  const result = db.runSync(
    `DELETE FROM user_academic WHERE id = ?;`,
    [id]
  );
  return result;
};

export default {
    init,
    upsertAcademic,
    getAcademicById,
    deleteAcademicById
}