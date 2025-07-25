const express = require("express");
const cors = require("cors");
const mysql = require("mysql");

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "my1Admin2#",
  database: "crud",
});

app.get("/", (req, res) => {
  // res.json("Hello from Backend");
  const sql = "SELECT * FROM student";
  db.query(sql, (err, data) => {
    if (err) return res.json("Error!");
    return res.json(data);
  });
});

app.post("/create", (req, res) => {
  const sql = "INSERT INTO student(`Name`,`Email`) VALUES(?) ";
  const values = [req.body.name, req.body.email];
  db.query(sql, [values], (err, data) => {
    if (err) return res.json("Error!");
    return res.json(data);
  });
});

app.put("/update/:id", (req, res) => {
  const sql = "UPDATE student SET `Name`=? ,`Email`=? WHERE ID =? ";
  const id = req.params.id;
  const values = [req.body.name, req.body.email];
  db.query(sql, [...values, id], (err, data) => {
    if (err) return res.json("Error!");
    return res.json(data);
  });
});

app.delete("/student/:id", (req, res) => {
  const sql = "DELETE FROM student WHERE ID =? ";
  const id = req.params.id;
  db.query(sql, [id], (err, data) => {
    if (err) return res.json("Error!");
    return res.json(data);
  });
});

const PORT = 8081;
app.listen(PORT, () => {
  console.log(`Listening On PORT ${PORT}`);
});
