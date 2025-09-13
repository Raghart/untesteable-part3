import argon2 from "@node-rs/argon2";
import pg from "pg";

// The class  writes to a real persistent database, which is a problem because every change will
// persist between tests, making it hard to make consistent test to prove that is capable to save the users and
// password hashes. This is why for testing, is better to create a database in memory using SQlite or PostgreSQL 
// instance so each test start with a blank state. Another issue  is that the class uses a Singleton which is sharing 
// an instance across all tests instead of creating a fresh state for each run. 

export class PostgresUserDao {
  static instance;

  static getInstance() {
    if (!this.instance) {
      this.instance = new PostgresUserDao();
    }
    return this.instance;
  }

  db = new pg.Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
  });

  close() {
    this.db.end();
  }

  #rowToUser(row) {
    return { userId: row.user_id, passwordHash: row.password_hash };
  }

  async getById(userId) {
    const { rows } = await this.db.query(
      `select user_id, password_hash
       from users
       where user_id = $1`,
      [userId]
    );
    return rows.map(this.#rowToUser)[0] || null;
  }

  async save(user) {
    await this.db.query(
      `insert into users (user_id, password_hash)
       values ($1, $2)
       on conflict (user_id) do update
           set password_hash = excluded.password_hash`,
      [user.userId, user.passwordHash]
    );
  }
}

export class PasswordService {
  users = PostgresUserDao.getInstance();

  async changePassword(userId, oldPassword, newPassword) {
    const user = await this.users.getById(userId);
    if (!argon2.verifySync(user.passwordHash, oldPassword)) {
      throw new Error("wrong old password");
    }
    user.passwordHash = argon2.hashSync(newPassword);
    await this.users.save(user);
  }
}
