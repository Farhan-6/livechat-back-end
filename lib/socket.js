const { WebSocketServer } = require("ws");
const http = require("http");
const express = require("express");

const app = express();
const server = http.createServer(app);

const userSocketMap = {};

function getReceiverSocket(userId) {
  return userSocketMap[userId];
}

const wss = new WebSocketServer({ server });

wss.on("connection", (ws, req) => {
  const params = new URLSearchParams(req.url.replace("/?", ""));
  const userId = params.get("userId");

  if (userId) {
    userSocketMap[userId] = ws;
  }

  ws.on("close", () => {
    if (userId) delete userSocketMap[userId];
  });
});

console.log('WebSocket server running on ws://localhost:4000');

module.exports = { app, server, getReceiverSocket };
