import db from '../config/db.js';
import '../config/passport.js';
import bcrypt from 'bcrypt';

const saltRounds = 10;

class User {
    static async findByUsername(username) {
        try {
            const result = await db.query("SELECT * FROM users WHERE user_name = $1", [username]);
            return result.rows[0]; // Returns user object or undefined
        } catch (err) {
            throw err;
        }
    }

    static async findByEmail(email) {
        try {
            const result = await db.query("SELECT * FROM users WHERE user_email = $1", [email]);
            return result.rows[0];
        } catch (err) {
            throw err;
        }
    }

    static async findById(id) {
        try {
            const result = await db.query("SELECT * FROM users WHERE user_id = $1", [id]);
            return result.rows[0]; // Returns the user object
        } catch (err) {
            throw err;
        }
    }

    static async createUser(username, email, password) {
        try {
            const hash = await bcrypt.hash(password, saltRounds);
            const result = await db.query(
                "INSERT INTO users (user_name, user_email, user_hashed_password) VALUES ($1, $2, $3) RETURNING *",
                [username, email, hash]
            );
            return result.rows[0]; // Returns the newly created user
        } catch (err) {
            throw err;
        }
    }

    static async comparePassword(inputPassword, storedHashedPassword) {
        try {
            return await bcrypt.compare(inputPassword, storedHashedPassword);
        } catch (err) {
            throw err;
        }
    }
}

export default User;
