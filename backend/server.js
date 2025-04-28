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
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
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

// WebSocket
const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", (ws) => {
  console.log("Пользователь подключился");

  ws.on("message", (data) => {
    const message = JSON.parse(data);
    if (message.type == "login") {
      ws.userId = message.userId;
      console.log("DATA");
      console.log(ws.userId);
      console.log(message.userId);
      db.query("UPDATE users SET online = true WHERE id = $1", [ws.userId]);
    } else if (message.type == "logout") {
      db.query("UPDATE users SET online = false WHERE id = $1", [ws.userId]);
    }
  });

  ws.on("close", () => {
    console.log("Пользователь отключился");
    const userId = ws.userId;
    db.query(
      "UPDATE users SET online = false, updated_at = NOW() WHERE id = $1",
      [userId]
    );
  });
});

// =======

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

app.patch("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { email, username, password } = req.body;
  const user = await db.query("SELECT * FROM users WHERE id = $1", [id]);
  if (!user.rows[0]) {
    return res.status(404).json({ message: "User not found" });
  }
  let updatedUser = user.rows[0];
  if (email) {
    updatedUser.email = email;
  }
  if (username) {
    updatedUser.username = username;
  }
  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    updatedUser.password = hashedPassword;
  }
  await db.query(
    "UPDATE users SET email = $1, username = $2, password = $3 WHERE id = $4",
    [updatedUser.email, updatedUser.username, updatedUser.password, id]
  );
  res.json(updatedUser);
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

app.post("/posts", async (req, res) => {
  const { user_id, text } = req.body;
  const response = await db.query(
    "INSERT INTO posts (user_id, text) VALUES ($1, $2) RETURNING *",
    [user_id, text]
  );
  res.json(response.rows[0]);
});

app.get("/posts/:id", async (req, res) => {
  const { id } = req.params;
  const response = await db.query("SELECT * FROM posts WHERE (user_id = $1)", [
    id,
  ]);
  res.json(response.rows);
});

app.delete("/message/:id", async (req, res) => {
  const id = req.params.id;
  const last_message_chat = await db.query(
    "SELECT * FROM chats WHERE last_message_id = $1",
    [id]
  );
  if (last_message_chat.rows.length) {
    await db.query(
      "UPDATE chats SET last_message_id = NULL WHERE (uid_1 = $1 AND uid_2 = $2) OR (uid_1 = $2 AND uid_2 = $1)",
      [last_message_chat.rows[0].uid_1, last_message_chat.rows[0].uid_2]
    );
  }
  const response = await db.query("DELETE FROM messages WHERE id = $1", [id]);
  res.json(response.rows);
});

// app.delete("/message/:id", async (req, res) => {
//   const id = req.params.id;
//   // const last_message_chat = await db.query(
//   //   "SELECT * FROM chats WHERE last_message_id = $1", // выбор чата который надо обновить
//   //   [id]
//   // );
//   // if (last_message_chat.rows.length) {
//   //   const last_message_id = await db.query(
//   //     "SELECT id FROM messages WHERE (id1 = $1 AND id2 = $2) OR (id1 = $2 AND id2 = $1) ORDER BY created_at DESC LIMIT 2",
//   //     [last_message_chat.rows[0].uid_1, last_message_chat.rows[0].uid_2] // выбор id последнего сообщения
//   //   );
//   //   await db.query(
//   //     "UPDATE chats SET last_message_id = $1 WHERE (uid_1 = $2 AND uid_2 = $3) OR (uid_1 = $3 AND uid_2 = $2)",
//   //     [
//   //       // обновить последнее сообщение id
//   //       last_message_id.rows[1].id,
//   //       last_message_chat.rows[1].uid_1,
//   //       last_message_chat.rows[1].uid_2,
//   //     ]
//   //   );
//   // }
//   const response = await db.query("DELETE FROM messages WHERE id = $1", [id]);
//   res.json(response.rows);
// });

app.get("/users", async (req, res) => {
  // const response = await db.query(
  //   "SELECT users.id as id, users.username as username, users.email as email, avatars.avatar_path as avatar_path  FROM users LEFT JOIN avatars ON users.id = avatars.user_id"
  // );

  const response = await db.query(
    "SELECT users.updated_at, users.online, users.id, users.username, users.email, MAX(avatars.avatar_path) AS avatar_path FROM users LEFT JOIN avatars ON users.id = avatars.user_id GROUP BY users.id, users.username, users.email;"
  );
  res.json(response.rows);
});

app.get("/users/:id", async (req, res) => {
  const id = req.params.id;
  const response = await db.query("SELECT * FROM users WHERE id = $1", [id]);
  res.json(response.rows);
});

app.get("/avatars/:id", async (req, res) => {
  const id = req.params.id;
  const response = await db.query(
    "SELECT * FROM avatars WHERE user_id = $1 ORDER BY created_at DESC",
    [id]
  );
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
    "SELECT chats.id AS chat_id, messages.message AS last_message, CASE WHEN uid_1 = $1 THEN uid_2 ELSE uid_1 END AS other_uid, CASE WHEN uid_1 = $1 THEN user2.username ELSE user1.username END AS other_username, (CASE WHEN uid_1 = $1 THEN avatars2.avatar_path ELSE avatars1.avatar_path END) AS avatar_path, messages.created_at AS timestamp FROM chats LEFT JOIN messages ON chats.last_message_id = messages.id JOIN users AS user1 ON chats.uid_1 = user1.id JOIN users AS user2 ON chats.uid_2 = user2.id LEFT JOIN avatars AS avatars1 ON user1.id = avatars1.user_id LEFT JOIN avatars AS avatars2 ON user2.id = avatars2.user_id WHERE uid_1 = $1 OR uid_2 = $1 GROUP BY chats.id, messages.message, other_uid, other_username, messages.created_at, (CASE WHEN uid_1 = $1 THEN avatars2.avatar_path ELSE avatars1.avatar_path END)",
    [uid]
  );
  res.json(response.rows);
});

// app.get("/chats/:uid", async (req, res) => {
//   const response = await db.query(
//     "SELECT u.id, u.username, u.updated_at, u.online, MAX(a.avatar_path) as avatar_path " +
//       "FROM chats c " +
//       "JOIN users u ON c.contact_id = u.id " +
//       "LEFT JOIN avatars a ON u.id = a.user_id " +
//       "WHERE c.user_id = $1 " +
//       "GROUP BY u.id, u.username, u.updated_at, u.online",
//     [req.params.uid]
//   );
//   res.json(response.rows);
// });
// app.get("/chats/:uid", async (req, res) => {
//   const uid = req.params.uid;
//   const response = await db.query(
//     "SELECT messages.message AS last_message, CASE WHEN uid_1 = $1 THEN uid_2 ELSE uid_1 END AS other_uid, CASE WHEN uid_1 = $1 THEN user2.username ELSE user1.username END AS other_username, messages.created_at AS timestamp FROM chats JOIN messages ON chats.last_message_id = messages.id JOIN users AS user1 ON chats.uid_1 = user1.id JOIN users AS user2 ON chats.uid_2 = user2.id WHERE uid_1 = $1 OR uid_2 = $1",
//     [uid]
//   );
//   res.json(response.rows);
// });

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

app.delete("/chats/:id", async (req, res) => {
  const id = req.params.id;
  const chat = await db.query("SELECT * FROM chats WHERE id = $1", [id]);

  const uid1 = chat.rows[0].uid_1;
  const uid2 = chat.rows[0].uid_2;

  await db.query("DELETE FROM chats WHERE id = $1", [id]);

  const response = await db.query(
    "DELETE FROM messages WHERE (id1 = $1 AND id2 = $2) OR (id1 = $2 AND id2 = $1)",
    [uid1, uid2]
  );

  res.json(response.rows);
});

app.post("/contacts", async (req, res) => {
  const res1 = await db.query(
    "SELECT * FROM contacts WHERE user_id = $1 AND contact_id = $2",
    [req.body.user_id, req.body.contact_id]
  );
  if (res1.rows.length > 0) {
    const response = await db.query(
      "DELETE FROM contacts WHERE user_id = $1 AND contact_id = $2",
      [req.body.user_id, req.body.contact_id]
    );
  } else {
    const response = await db.query(
      "INSERT INTO contacts (user_id, contact_id) VALUES ($1, $2) ",
      [req.body.user_id, req.body.contact_id]
    );
  }
});

app.get("/contacts/:user_id/:contact_id", async (req, res) => {
  const response = await db.query(
    "SELECT * FROM contacts WHERE user_id = $1 AND contact_id = $2",
    [req.params.user_id, req.params.contact_id]
  );
  res.json(response.rows.length > 0);
});

app.get("/contacts/:user_id", async (req, res) => {
  const response = await db.query(
    "SELECT u.id, u.username, u.updated_at, u.online, MAX(a.avatar_path) as avatar_path " +
      "FROM contacts c " +
      "JOIN users u ON c.contact_id = u.id " +
      "LEFT JOIN avatars a ON u.id = a.user_id " +
      "WHERE c.user_id = $1 " +
      "GROUP BY u.id, u.username, u.updated_at, u.online",
    [req.params.user_id]
  );
  res.json(response.rows);
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
  console.log("---------===");
});
