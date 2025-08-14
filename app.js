const express = require("express");
const http = require("http");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { app, server } = require("./lib/socket.js");
require("dotenv").config();

require("./lib/db");

const authRoutes = require("./routes/auth.route.js");
const messageRoutes = require("./routes/message.route.js");

const port = process.env.PORT;

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }))


app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

// app.use(cors({
//   origin: (origin, callback) => {
//     if (!origin) return callback(null, true); // allow requests without origin (like Postman)
//     const hostname = new URL(origin).hostname;

//     // Allow localhost for dev
//     if (hostname === 'localhost' || hostname === '127.0.0.1') {
//       return callback(null, true);
//     }

//     // Allow any ngrok subdomain
//     if (/\.ngrok-free\.app$/.test(hostname)) {
//       return callback(null, true);
//     }

//     // Block other origins
//     callback(new Error('Not allowed by CORS'));
//   },
//   credentials: true
// }));




app.get("/", (req, res) => {
  res.send("This is live chat");
});

app.use('/api/auth', authRoutes);
app.use("/api/message", messageRoutes);

server.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
