const express = require('express');
const http = require('http');
const path = require('path');
const bp = require('body-parser');
const moment = require('moment');

const app = express();
const server = http.createServer(app);
const PORT = process.env.port || 4000;
server.listen(PORT, ()=>{
  console.log(`listening at port ${PORT}`);
})


/*  chat socket io */
const socket = require('socket.io');
const io = socket(server);

const users = {};

io.on('connection', socket => {
  if (!users[socket.id]) {
      users[socket.id] = socket.id;
  }
  socket.emit("yourID", socket.id);
  io.sockets.emit("allUsers", users);
  socket.on('disconnect', () => {
      delete users[socket.id];
  })

  socket.on("callUser", (data) => {
      io.to(data.userToCall).emit('hey', {signal: data.signalData, from: data.from});
  })

  socket.on("acceptCall", (data) => {
      io.to(data.to).emit('callAccepted', data.signal);
  })
});



/*io.on('connection', (socket)=>{

  const messages = [];

  socket.on('newMessage', (message) => {
    if(messages.length == 16){
      messages.shift();
    }

    message = {text: message, date: moment().format('HH:mm')};
    messages.push(message);
    io.emit("FromAPI", messages);
  })

  socket.on('disconnect', ()=>{
    io.emit('candidateDisconnected');
  })
 })

 */




app.use(bp.json());
app.use(express.static(path.join(__dirname, 'client/build')));


const firms = [
  {id: 4, candidatesId: [24, 51, 76]}, 
  {id: 79, candidatesId: [87, 149, 563]}
];

const candidates = [
    {
    id:51, firmId: 4, email: "lalou.zacharie@oostaoo.com", nom: 'Brown', prenom: 'James'
    },
    {
    id:24, firmId: 4, email: 'hamdoun.ismael@oostaoo.com', nom: 'Maz', prenom: 'Isma'
    },
    {
    id:76, firmId: 4, email: 'famady@oostaoo.com', nom: 'Trankillouche', prenom: "Famadouche"
    }
]

app.get('/candidates/:firmId', async (req, res) => {
  const firmId = req.params.firmId;
  let firmCandidates = candidates.filter(c=>c.firmId == firmId);
  res.send(JSON.stringify(firmCandidates));
})


