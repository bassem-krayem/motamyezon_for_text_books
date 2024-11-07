# Motamyezon for Text Books

## Table of Contents

- [Overview 📄](#overview-)
- [Features 💡](#features-)
- [Installation Process 💻](#installation-process-)
- [Technologies Used ⚙️](#technologies-used-)
- [Challenges 🎯](#challenges-)
- [Inspiration 🔍](#inspiration-)
- [Future Plans 📆](#future-plans-)
- [Authors 👨‍💻](#authors-)
- [Acknowledgments 👥](#acknowledgments-)

## Overview 📄

**Motamyezon for Text Books** is a platform designed to make books accessible for blind users by providing them in formats such as EPUB, AZW3, and KFX. Created to support the volunteer team Motamyezon, this project enables easy browsing, downloading, and managing books in accessible formats, making reading more inclusive.

- [Motamyezon Landing Page](bassem.github.io/motamyezon_for_text_books_landing_page)

## Features 💡

1. **Accessible Book Uploads**
   - Admins can upload books in multiple formats (EPUB, AZW3, KFX) to ensure accessibility for blind readers.
2. **Organized Book Categories**

   - Admins can add categories, allowing users to filter books by genre or topic for easy browsing.

3. **Book Details and Downloads**

   - Each book entry displays the title, author, description, and format options, with download links for user-friendly access.

4. **Admin Management Tools**
   - Admins have options to update or delete book listings, ensuring the library remains current and organized.

## Installation Process 💻

> **Note**: This setup is designed for Unix-based systems (Linux or macOS). Ensure you have Node.js and PostgreSQL installed.

1. **Clone the Repository**
   ```bash
   git clone https://github.com/bassem-krayem/motamyezon_for_text_books.git
   ```
2. **Navigate to the Project Directory**

   ```bash
   cd motamyezon_for_text_books
   ```

3. **Install Dependencies**

   - Use npm to install all necessary packages listed in `package.json`:

   ```bash
   npm install
   ```

4. **Set Up the Database**

   1. **Open PostgreSQL**:

      - Start by opening the PostgreSQL interactive terminal:

      ```bash
      psql -U your_username -d postgres
      ```

   2. **Create the Database**:

      - Create a new database named `motamyezon`:

      ```sql
      CREATE DATABASE motamyezon;
      ```

      - Then, switch to the created database

      ```sql
      \c motamyezon
      ```

   3. **Create the Tables**:

      - Use the provided SQL script to create the necessary tables. Run the following command in the terminal to pipe the `create_table.sql` script into PostgreSQL:

      ```bash
      cat sql_scripts/create_tables.sql | psql -U your_username -d motamyezon
      ```

   4. **Configure Environment Variables**:

      - In the root of the project, create a `.env` file after installing dependencies.
      - Replace the placeholders below with your own PostgreSQL credentials (such as `PG_USER` and `PG_PASSWORD`), and add the following environment variables to the `.env` file:

      ```plaintext
      PG_USER=your_postgresql_username
      PG_HOST="localhost"
      PG_DATABASE=motamyezon
      PG_PASSWORD=your_postgresql_password
      PG_PORT=5432
      SESSION_SECRET="books from motamyezon"
      ```

5. **Run the Application**
   ```bash
   npm start
   ```

## Technologies Used ⚙️

- **Node.js** (backend runtime)
- **Express** (web framework for backend API)
- **PostgreSQL** (database for managing book and user information)
- **HTML/CSS** (frontend for displaying book data)
- **GitHub Pages** (for the project landing page)

## Challenges 🎯

### Technical Challenges

- Developing a robust system for storing and retrieving books in multiple formats.
- Implementing user-friendly navigation and ensuring all features are fully accessible for screen readers.

### Non-Technical Challenges

- Coordinating with the volunteer team to align on their needs and platform functionality.
- Ensuring a smooth user experience that meets accessibility standards.

## Inspiration 🔍

The inspiration for **Motamyezon for Text Books** comes from the efforts of the Motamyezon team, a volunteer group dedicated to converting books into accessible formats for blind readers. Inspired by the dedication of this team, this project was created to provide a more structured platform that supports their work and expands access to books for blind users.

## Future Plans 📆

- **Enhanced User Interface**: Continue improving the accessibility features for easier navigation.
- **Mobile Optimization**: Make the platform mobile-friendly.
- **User Profiles**: Allow users to track their downloads and create personalized book lists.
- **Expanded Book Formats**: Add support for additional accessible book formats as needed.
- **Integration with Online Libraries**: Explore partnerships with libraries to expand book offerings.

## Authors 👨‍💻

- **Bassem Krayem** ([LinkedIn](https://www.linkedin.com/in/bassem-krayem), [GitHub](https://github.com/bassem-krayem))

## Acknowledgments 👥

- **Holberton School** for providing the educational foundation for this project.
- **Motamyezon Team** for inspiring this project with their commitment to accessibility.
- **Mentors and Peers** for their invaluable support and guidance.

```

```
