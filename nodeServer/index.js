const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path')
const app = express();
const server = http.createServer(app);


// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, '..')));

// route to serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
  });
  

const io = socketIo(server, {
  cors: {
    origin: "*"
  }
});


const users = {};

io.on('connection', socket => {
  socket.on('new-user-joined', name => {
    console.log("New user", name);
    users[socket.id] = name;
    socket.broadcast.emit('user-joined', name);
  });

  socket.on('send', message => {
    socket.broadcast.emit('receive', { message, name: users[socket.id] });
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('left', users[socket.id]);
    delete users[socket.id];
  });
});

server.listen(8000, () => {
  console.log('Server running at http://localhost:8000');
});
