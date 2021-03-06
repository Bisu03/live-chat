const express = require("express");
const app = express();
const http = require('http');
const server = http.createServer(app);
const path = require("path");
const port = process.env.PORT || 3000;
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static(path.join(__dirname, "/public")));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

const users = {}

io.on('connection', socket => {
  socket.on('new-user-joined', name => {
    console.log("New user", name);
    users[socket.id] = name;
    socket.broadcast.emit('user-joined', name);
  });

  socket.on('send', message => {
    socket.broadcast.emit('receive', { message: message, name: users[socket.id] })
  });

  socket.on('disconnect', message => {
    socket.broadcast.emit('left', users[socket.id]);
    delete users[socket.id];
  });
})

server.listen(port, () =>
  console.log(`Example app listening on port http://localhost:${port}`)
);
