const app = require('express')();
const http = require('http').createServer(app);

require('dotenv').config();
const PORT = process.env.PORT;

const io = require('socket.io')(http);

const moment = require('moment');
const rooms = {};

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


io.on("connection", socket => {


    io.emit('FromApi', messages);

    socket.on('newMessage', (message) => {
    if(messages.length == 16){
      messages.shift();
    }
    message = {text: message, date: moment().format('HH:mm')};
    messages.push(message);
    console.log('messages : ', messages);
    io.emit("FromAPI", messages);
    })

    socket.on("join room", roomID => {
        // console.log(socket);
        if (rooms[roomID]) {
            rooms[roomID].push(socket.id);
        } else {
            rooms[roomID] = [socket.id];
        }
        const otherUser = rooms[roomID].find(id => id !== socket.id);
        if (otherUser) {
            socket.emit("other user", otherUser);
            socket.to(otherUser).emit("user joined", socket.id);
        }
    });

    socket.on("offer", payload => {
        io.to(payload.target).emit("offer", payload);
    });

    socket.on("answer", payload => {
        io.to(payload.target).emit("answer", payload);
    });

    socket.on("ice-candidate", incoming => {
        io.to(incoming.target).emit("ice-candidate", incoming.candidate);
    });
});


http.listen(PORT, () => console.log(`server is running on port ${PORT}`));
