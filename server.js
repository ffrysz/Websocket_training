const express = require('express');
const path = require('path');
const socket = require('socket.io');
const app = express();
const messages = [];
const users = [];

app.use(express.static(path.join(__dirname, '/client')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/index.html'));
})

const server = app.listen(8000, () => {
  console.log('Server is running on port 8000...');
})

const io = socket(server);

io.on('connection', (socket) => {
  console.log('New client! Its id – ' + socket.id);
  socket.on('login', ({ author }) => {
    const data = {
      name: author,
      id: socket.id,
    }
    users.push(data);
    console.log(`${author} has joined the chat!`);
    socket.broadcast.emit('message', {
      author: 'Chat bot',
      content: `${author} has joined the conversation!`,
    });
  });
  socket.on('message', (message) => {
    console.log('Oh, I\'ve got something from ' + socket.id);
    messages.push(message);
    socket.broadcast.emit('message', message);
  });
  socket.on('disconnect', () => {
    const removedIndex = users.findIndex((el) => {
      return el.id == socket.id;
    });
    const leavingName = users[removedIndex].name;
    socket.broadcast.emit('message', {
      author: 'Chat bot',
      content: `${leavingName} has left the conversation... :( !`,
    });
    users.splice(removedIndex, 1);
    console.log('Oh, socket ' + socket.id + ' has left');
  });
});