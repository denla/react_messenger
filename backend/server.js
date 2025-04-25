const express = require("express");
const app = express();
const pg = require("pg");
const bcrypt = require("bcrypt");

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Max-Age", "3600");
  next();
});

app.use(express.json());

const db = new pg.Pool({
  user: "postgres",
  host: "localhost",
  database: "test_db",
  password: "postgres",
  port: 5432,
});

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await db.query(
    "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
    [username, email, hashedPassword]
  );
  res.json(user.rows[0]);
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await db.query("SELECT * FROM users WHERE email = $1", [email]);
  if (!user.rows[0]) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  console.log("Пароль, который вы отправляете:", password);
  console.log("Пароль, который хранится в базе данных:", user.rows[0].password);
  const isValidPassword = await bcrypt.compare(password, user.rows[0].password);
  console.log("Результат сравнения паролей:", isValidPassword);
  if (!isValidPassword) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  res.json(user.rows[0]);
});

app.post("/message", async (req, res) => {
  const { id1, id2, message } = req.body;
  const response = await db.query(
    "INSERT INTO messages (id1, id2, message) VALUES ($1, $2, $3) RETURNING *",
    [id1, id2, message]
  );
  res.json(response.rows[0]);
});

app.get("/message", async (req, res) => {
  const { id1, id2 } = req.query;
  const response = await db.query(
    "SELECT * FROM messages WHERE (id1 = $1 AND id2 = $2) OR (id1 = $2 AND id2 = $1)",
    [id1, id2]
  );
  res.json(response.rows);
});

app.get("/users", async (req, res) => {
  const response = await db.query("SELECT * FROM users");

  res.json(response.rows);
});

app.get("/users/:id", async (req, res) => {
  const id = req.params.id;
  const response = await db.query("SELECT * FROM users WHERE id = $1", [id]);
  res.json(response.rows);
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal Server Error" });
});

app.listen(3001, () => {
  console.log("Server started on port 3001");
});
