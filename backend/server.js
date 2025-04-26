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

app.use("/uploads", express.static("uploads"));

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

// app.get("/chats/:uid", async (req, res) => {
//   const uid = req.params.uid;
//   const response = await db.query(
//     "SELECT messages.message AS last_message, uid_1, uid_2, user1.username AS username1, user2.username AS username2, messages.created_at AS timestamp FROM chats JOIN messages ON chats.last_message_id = messages.id JOIN users AS user1 ON chats.uid_1 = user1.id JOIN users AS user2 ON chats.uid_2 = user2.id WHERE uid_1 = $1 OR uid_2 = $1",
//     [uid]
//   );
//   res.json(response.rows);
// });

app.get("/chats/:uid", async (req, res) => {
  const uid = req.params.uid;
  const response = await db.query(
    "SELECT messages.message AS last_message, CASE WHEN uid_1 = $1 THEN uid_2 ELSE uid_1 END AS other_uid, CASE WHEN uid_1 = $1 THEN user2.username ELSE user1.username END AS other_username, messages.created_at AS timestamp FROM chats JOIN messages ON chats.last_message_id = messages.id JOIN users AS user1 ON chats.uid_1 = user1.id JOIN users AS user2 ON chats.uid_2 = user2.id WHERE uid_1 = $1 OR uid_2 = $1",
    [uid]
  );
  res.json(response.rows);
});

app.post("/chats", async (req, res) => {
  const { uid_1, uid_2, last_message_id } = req.body;
  const response = await db.query(
    "SELECT * FROM chats WHERE (uid_1 = $1 AND uid_2 = $2) OR (uid_1 = $2 AND uid_2 = $1)",
    [uid_1, uid_2]
  );
  if (response.rows.length == 0) {
    const res2 = await db.query(
      "INSERT INTO chats (uid_1, uid_2, last_message_id) VALUES ($1, $2, $3) RETURNING *",
      [uid_1, uid_2, last_message_id]
    );
    res.json(res2.rows[0]);
  } else {
    const res2 = await db.query(
      "UPDATE chats SET last_message_id = $3 WHERE (uid_1 = $1 AND uid_2 = $2) OR (uid_1 = $2 AND uid_2 = $1) RETURNING *",
      [uid_1, uid_2, last_message_id]
    );
    res.json(res2.rows[0]);
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal Server Error" });
});

app.listen(3001, () => {
  console.log("Server started on port 3001");
});

// avatars
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

app.post("/upload-avatar", upload.single("avatar"), (req, res) => {
  const userId = req.body.userId;
  const avatarPath = `uploads/${req.file.filename}`;

  console.log(req.file.filename);

  // Сохраните путь к аватару в базе данных
  const query = {
    text: "INSERT INTO avatars (user_id, avatar_path) VALUES ($1, $2)",
    values: [userId, avatarPath],
  };
  db.query(query, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send({ message: "Ошибка загрузки аватара" });
    } else {
      res.send({ message: "Аватар загружен успешно" });
    }
  });
});

app.get("/avatar/:uid", async (req, res) => {
  const uid = req.params.uid;
  const response = await db.query("SELECT * FROM avatars WHERE user_id = $1", [
    uid,
  ]);
  console.log("TEST");
  console.log(response.rows);
  res.json(response.rows);
});
