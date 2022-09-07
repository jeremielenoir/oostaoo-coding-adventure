const app = require('express')();
const http = require('http');
const { uuid } = require('uuidv4');
// const path = require('path');
// const fs = require('fs');

const httpServer = http.createServer(
  // {
  //   key: fs.readFileSync(path.join(__dirname, 'SSL_cert', 'key.pem')),
  //   cert: fs.readFileSync(path.join(__dirname, 'SSL_cert', 'cert.pem')),
  // },
  app,
);

const io = require('socket.io').listen(httpServer);

const moment = require('moment');
const config = require('./config');

const rooms = [];

/* pour plus tard
var room = io.sockets.in('some super awesome room');
room.on('join', function() {
  console.log("Someone joined the room.");
});
room.on('leave', function() {
  console.log("Someone left the room.");
});

socket.join('some super awesome room');
socket.broadcast.to('some super awesome room').emit('join');

setTimeout(function() {
  socket.leave('some super awesome room');
  io.sockets.in('some super awesome room').emit('leave');
}, 10 * 1000);
*/

var messages = [];

io.on('connection', (socket) => {
  io.emit('FromApi', messages);
  socket.emit('my-id', socket.id);

  socket.on('disconnect', () => {
    socket.broadcast.emit('CallEnded');
  });

  socket.on('send-call', (data) => {
    io.to(data.userToCall).emit('send-call', {
      signal: data.signalData,
      from: data.from,
    });
  });

  socket.on('receive-call', (data) => {
    io.to(data.to).emit('call-received', data.signal);
  });

  socket.on('newMessage', (message) => {
    if (messages.length === 30) {
      messages.shift();
    }
    const newMessage = {
      text: message,
      date: moment().format('HH:mm'),
      id: uuid(),
    };
    messages.push(newMessage);
    console.log('messages : ', messages);
    io.emit('FromAPI', messages);
  });

  socket.on('join room', (roomID) => {
    console.log(`User ${socket.id} joined room ${roomID}`);

    const newRoom = {
      id: roomID,
      users: [socket.id],
    };

    const doesRoomExists = rooms.find((room) => room.id === roomID);
    if (doesRoomExists) {
      const amIConnected = doesRoomExists.users.find(
        (user) => user === socket.id,
      );
      if (!amIConnected) {
        doesRoomExists.users.push(socket.id);
      }

      const otherUser = doesRoomExists.users.find((user) => user !== socket.id);
      if (otherUser) {
        socket.emit('other user', otherUser);
        console.log('Room partner : ', otherUser);
      }
    } else {
      rooms.push(newRoom);
    }

    // if (rooms[roomID]) {
    //   rooms[roomID].push(socket.id);
    // } else {
    //   rooms[roomID] = [socket.id];
    // }

    io.emit('FromAPI', messages);

    // const otherUser = rooms[roomID].find((id) => id !== socket.id);
    // if (otherUser) {
    //   socket.emit('other user', otherUser);
    //   socket.to(otherUser).emit('user joined', socket.id);
    // }
  });

  // socket.on('offer', (payload) => {
  //   io.to(payload.target).emit('offer', payload);
  // });

  // socket.on('answer', (payload) => {
  //   io.to(payload.target).emit('answer', payload);
  // });

  // socket.on('ice-candidate', (incoming) => {
  //   io.to(incoming.target).emit('ice-candidate', incoming.candidate);
  // });
});

httpServer.listen(config.PORT, config.HOST, () => {
  console.log(`APP LISTENING ON http://${config.HOST}:${config.PORT}`);
});
