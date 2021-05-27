const socket = io('/');

socket.emit('join-room', ROOM_ID, 10);

// listen the event
socket.on('user-connected', (userId) => {
  console.log(`${userId} is connected`);
});
