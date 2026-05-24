
const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");

const app = express();

// =======================================================
// MIDDLEWARE
// =======================================================

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// =======================================================
// DATABASE CONNECTION
// =======================================================

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "appec_system"
});

db.connect((err) => {

    if (err) {
        console.log(err);
    } else {
        console.log("MySQL Connected");
    }

});

// =======================================================
// CREATE TABLES
// =======================================================

const studentTable = `
CREATE TABLE IF NOT EXISTS students(
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullname VARCHAR(100),
    email VARCHAR(100),
    course VARCHAR(100),
    gender VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
`;

const bookTable = `
CREATE TABLE IF NOT EXISTS books(
    id INT AUTO_INCREMENT PRIMARY KEY,
    bookname VARCHAR(100),
    author VARCHAR(100),
    category VARCHAR(100),
    quantity INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
`;

db.query(studentTable);
db.query(bookTable);

// =======================================================
// GLOBAL HTML
// =======================================================

let studentsHTML = "";
let booksHTML = "";

// =======================================================
// LOAD STUDENTS
// =======================================================

function loadStudents(callback) {

    db.query(
        "SELECT * FROM students",
        (err, result) => {

            studentsHTML = "";

            result.forEach((student) => {

                studentsHTML += `
                <tr>
                    <td>${student.id}</td>
                    <td>${student.fullname}</td>
                    <td>${student.email}</td>
                    <td>${student.course}</td>
                    <td>${student.gender}</td>

                    <td>
                        <a href="/delete-student/${student.id}">
                        <button class="delete">
                        Delete
                        </button>
                        </a>
                    </td>
                </tr>
                `;

            });

            callback();

        }
    );

}

// =======================================================
// LOAD BOOKS
// =======================================================

function loadBooks(callback) {

    db.query(
        "SELECT * FROM books",
        (err, result) => {

            booksHTML = "";

            result.forEach((book) => {

                booksHTML += `
                <tr>
                    <td>${book.id}</td>
                    <td>${book.bookname}</td>
                    <td>${book.author}</td>
                    <td>${book.category}</td>
                    <td>${book.quantity}</td>

                    <td>
                        <a href="/delete-book/${book.id}">
                        <button class="delete">
                        Delete
                        </button>
                        </a>
                    </td>
                </tr>
                `;

            });

            callback();

        }
    );

}

// =======================================================
// HOME PAGE
// =======================================================

app.get("/", (req, res) => {

    loadStudents(() => {

        loadBooks(() => {

            res.send(`

<!DOCTYPE html>
<html>
<head>

<title>
APPEC COLLEGE & LIBRARY SYSTEM
</title>

<style>

*{
    margin:0;
    padding:0;
    box-sizing:border-box;
    font-family:Arial;
}

body{
    background:#f4f6f9;
}

/* NAVBAR */

.navbar{
    background:#002147;
    color:white;
    padding:15px;
    display:flex;
    justify-content:space-between;
    align-items:center;
}

.navbar h1{
    font-size:24px;
}

.navbar a{
    color:white;
    text-decoration:none;
    margin:10px;
}

/* HERO */

.hero{
    height:350px;
    background:
    linear-gradient(
    rgba(0,0,0,.7),
    rgba(0,0,0,.7)),
    url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f');

    background-size:cover;
    background-position:center;

    display:flex;
    justify-content:center;
    align-items:center;
    flex-direction:column;

    color:white;
    text-align:center;
}

.hero h2{
    font-size:45px;
}

.hero p{
    margin-top:10px;
    font-size:20px;
}

/* CONTAINER */

.container{
    width:90%;
    margin:auto;
    margin-top:30px;
}

/* CARD */

.card{
    background:white;
    padding:20px;
    border-radius:10px;
    margin-bottom:30px;
    box-shadow:0 0 10px rgba(0,0,0,.1);
}

/* FORM */

input,select{
    width:100%;
    padding:12px;
    margin-top:10px;
    border:1px solid #ccc;
    border-radius:5px;
}

button{
    padding:12px 20px;
    margin-top:15px;
    border:none;
    background:#002147;
    color:white;
    border-radius:5px;
    cursor:pointer;
}

button:hover{
    background:#004080;
}

.delete{
    background:red;
}

/* TABLE */

table{
    width:100%;
    border-collapse:collapse;
    margin-top:20px;
}

table th{
    background:#002147;
    color:white;
    padding:12px;
}

table td{
    padding:12px;
    border:1px solid #ddd;
}

/* FOOTER */

.footer{
    background:#002147;
    color:white;
    text-align:center;
    padding:20px;
    margin-top:40px;
}

</style>

</head>

<body>

<!-- NAVBAR -->

<div class="navbar">

<h1>
APPEC TSS COLLEGE
</h1>

<div>
<a href="/">Home</a>
<a href="#students">Students</a>
<a href="#library">Library</a>
</div>

</div>

<!-- HERO -->

<div class="hero">

<h2>
COLLEGE & LIBRARY SYSTEM
</h2>

<p>
Professional School Management System
</p>

</div>

<div class="container">

<!-- STUDENT FORM -->

<div class="card">

<h2>
Student Registration
</h2>

<form action="/register-student"
method="POST">

<input
type="text"
name="fullname"
placeholder="Full Name"
required>

<input
type="email"
name="email"
placeholder="Email"
required>

<select name="course">

<option>
Software Development
</option>

<option>
Networking
</option>

<option>
Accounting
</option>

<option>
Multimedia
</option>

</select>

<select name="gender">

<option>Male</option>
<option>Female</option>

</select>

<button type="submit">
Register Student
</button>

</form>

</div>

<!-- STUDENTS TABLE -->

<div class="card" id="students">

<h2>
Registered Students
</h2>

<table>

<tr>

<th>ID</th>
<th>Full Name</th>
<th>Email</th>
<th>Course</th>
<th>Gender</th>
<th>Action</th>

</tr>

${studentsHTML}

</table>

</div>

<!-- LIBRARY FORM -->

<div class="card">

<h2>
Library Book Registration
</h2>

<form action="/add-book"
method="POST">

<input
type="text"
name="bookname"
placeholder="Book Name"
required>

<input
type="text"
name="author"
placeholder="Author"
required>

<input
type="text"
name="category"
placeholder="Category"
required>

<input
type="number"
name="quantity"
placeholder="Quantity"
required>

<button type="submit">
Add Book
</button>

</form>

</div>

<!-- BOOKS TABLE -->

<div class="card" id="library">

<h2>
Library Books
</h2>

<table>

<tr>

<th>ID</th>
<th>Book Name</th>
<th>Author</th>
<th>Category</th>
<th>Quantity</th>
<th>Action</th>

</tr>

${booksHTML}

</table>

</div>

</div>

<!-- FOOTER -->

<div class="footer">

<p>
© 2026 APPEC TSS COLLEGE
All Rights Reserved
</p>

</div>

</body>
</html>

            `);

        });

    });

});

// =======================================================
// REGISTER STUDENT
// =======================================================

app.post("/register-student",
(req, res) => {

    const {
        fullname,
        email,
        course,
        gender
    } = req.body;

    const sql = `
    INSERT INTO students(
        fullname,
        email,
        course,
        gender
    )
    VALUES(?,?,?,?)
    `;

    db.query(
        sql,
        [
            fullname,
            email,
            course,
            gender
        ],
        (err, result) => {

            if (err) {
                console.log(err);
            }

            res.redirect("/");

        }
    );

});

// =======================================================
// DELETE STUDENT
// =======================================================

app.get("/delete-student/:id",
(req, res) => {

    db.query(
        "DELETE FROM students WHERE id=?",
        [req.params.id],
        (err, result) => {

            res.redirect("/");

        }
    );

});

// =======================================================
// ADD BOOK
// =======================================================

app.post("/add-book",
(req, res) => {

    const {
        bookname,
        author,
        category,
        quantity
    } = req.body;

    const sql = `
    INSERT INTO books(
        bookname,
        author,
        category,
        quantity
    )
    VALUES(?,?,?,?)
    `;

    db.query(
        sql,
        [
            bookname,
            author,
            category,
            quantity
        ],
        (err, result) => {

            if (err) {
                console.log(err);
            }

            res.redirect("/");

        }
    );

});

// =======================================================
// DELETE BOOK
// =======================================================

app.get("/delete-book/:id",
(req, res) => {

    db.query(
        "DELETE FROM books WHERE id=?",
        [req.params.id],
        (err, result) => {

            res.redirect("/");

        }
    );

});

// =======================================================
// SERVER
// =======================================================

app.listen(3000, () => {

    console.log(
    "APPEC COLLEGE SYSTEM RUNNING");

    console.log(
    "http://localhost:3000");

});