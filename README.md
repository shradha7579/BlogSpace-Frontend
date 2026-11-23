# BlogSpace – Full Stack Blogging Application

## About the Project

BlogSpace is a full-stack blogging web application that allows users to register, log in, create blog posts, explore published blogs, and manage their own blogs.

This project was developed as part of my internship at Codomax Digital Solutions.

## Key Features

- User Registration and Login
- JWT-based Authentication
- Password Hashing using bcryptjs
- Protected User Dashboard
- Create New Blog Posts
- View Published Blogs
- Edit and Delete Own Blogs
- View My Blogs
- User Profile
- Logout Functionality

## Technologies Used

### Frontend

- HTML5
- CSS3
- JavaScript

### Backend

- Node.js
- Express.js

### Database

- MongoDB Atlas
- Mongoose

### Authentication

- JSON Web Token (JWT)
- bcryptjs

## Project Structure

```text
BlogSpace/
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   └── package.json
│
├── css/
│   └── style.css
│
├── js/
│   └── script.js
│
├── index.html
├── login.html
├── register.html
├── dashboard.html
├── create-blog.html
├── my-blogs.html
├── read-blog.html
└── README.md
```

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/shradha7579/BlogSpace-Frontend.git
```

### 2. Open Project Folder

```bash
cd BlogSpace-Frontend
```

### 3. Install Backend Dependencies

```bash
cd backend
npm install
```

### 4. Configure Environment Variables

Create a `.env` file inside the backend folder.

Configure the following variables using the names expected by your backend code:

- MongoDB connection string
- JWT secret
- Server port

Never upload your actual `.env` file to GitHub.

### 5. Start the Backend Server

```bash
node server.js
```

### 6. Run the Frontend

Open `index.html` using the VS Code Live Server extension.

## GitHub Repository

https://github.com/shradha7579/BlogSpace-Frontend

## Project Objective

The objective of BlogSpace is to develop a user-friendly blogging platform while learning full-stack web development, REST API integration, database connectivity, and secure user authentication.

## Developed By

**Shradha Ghadage**

**Internship:** Codomax Digital Solutions

---

Thank you for visiting BlogSpace!
