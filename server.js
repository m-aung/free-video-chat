import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { v4 } from 'uuid';

const app = express();
const server = createServer(app); // set up a server
const PORT = 3030;
const io = new Server(server); // serve the socket io

app.set('view engine', 'ejs'); // using server side rendering
app.use(express.static('public')); // set up static folder

// routes
// root
app.get('/', (req, res) => {
  res.redirect(`/${v4()}`);
});
//room
app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room });
});

io.on('connection', (socket) => {
  socket.on('join-room', (roomId, userId) => {
    // console.log('roomId:', roomId, '\n userId: ', userId);
    socket.join(roomId);
    socket.broadcast.to(roomId).emit('user-connected', userId).broadcast;
    socket.on('discconect', () => {
      socket.broadcast.to(roomId).emit('user-disconnected', userId).broadcast;
    });
  });
});

//run on the port
server.listen(PORT);
