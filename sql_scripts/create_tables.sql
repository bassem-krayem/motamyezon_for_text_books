-- try to create the data base first below then, connect to it using "psql -U username -d motamyezon"
-- after that you can paste this script to create "cat sql_scripts/create_tables.sql  | psql -U username -d motamyezon"
CREATE DATABASE motamyezon;
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    user_name VARCHAR(50) NOT NULL UNIQUE,
    user_email VARCHAR(100) NOT NULL UNIQUE,
    user_hashed_password VARCHAR(256) NOT NULL,
    user_type VARCHAR(40) DEFAULT 'user'
);
CREATE TABLE IF NOT EXISTS categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) UNIQUE
);
CREATE TABLE IF NOT EXISTS books(
    book_id SERIAL PRIMARY KEY,
    book_title VARCHAR(200) NOT NULL UNIQUE,
    book_author VARCHAR(100) NOT NULL,
    book_description TEXT,
    book_epub_url VARCHAR(200) NOT NULL,
    book_azw3_url VARCHAR(200) NOT NULL,
    book_kfx_url VARCHAR(200) NOT NULL,
    user_id INT REFERENCES users(user_id),
    category_id INT REFERENCES categories(category_id)
);