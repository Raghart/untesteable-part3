import pg from "pg";
import argon2 from "@node-rs/argon2";
import dotenv from "dotenv"; dotenv.config();

export class PostgresUserFixed {
    constructor() {
        this.db = new pg.Pool({
            user: process.env.PGUSER,
            host: process.env.PGHOST,
            database: process.env.PGDATABASE,
            password: process.env.PGPASSWORD,
            port: process.env.PGPORT,
        });    
    }

    close() { this.db.end(); };

    #rowtoUser(row) { return { userId: row.user_id, passwordHash: row.password_hash }; };

    async clearTable() { await this.db.query(`DELETE FROM users`) };

    async getByID(userId) {
        const { rows } = await this.db.query(
            `select user_id, password_hash
             from users
             where user_id = $1`,
             [userId]
        );
        return rows.map(this.#rowtoUser)[0] || null;
    };

    async save(user) { 
        await this.db.query(
        `insert into users (user_id, password_hash)
         values ($1, $2)
         on conflict (user_id) do update
         set password_hash = excluded.password_hash`,
         [user.userId, user.passwordHash]
        )
    };
};

export class PasswordServiceFixed {
    constructor(userDao) {
        this.userDao = userDao;
    }

    async changeUserPassword(userId, oldPassword, newPassword) {
        const user = await this.userDao.getByID(userId);
        if (!user) throw new Error(`The user with the id: ${userId} wasn't found.`);
        if (!argon2.verifySync(user.passwordHash, oldPassword)) throw new Error("wrong old password");
        user.passwordHash = argon2.hashSync(newPassword);
        await this.userDao.save(user);
    }
};