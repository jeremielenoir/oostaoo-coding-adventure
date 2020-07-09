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
const socketio = require('socket.io');
const io = socketio(server);


const messages = [];

io.on('connection', (socket)=>{

  socket.on('newMessage', (message) => {
    if(messages.length == 16){
      messages.shift();
    }

    message = {text: message, date: moment().format('HH:mm')};
    messages.push(message);
    io.emit("FromAPI", messages);
  })

  /*socket.on('disconnect', ()=>{
    io.emit('candidateDisconnected');
  })
  */
})




app.use(bp.json());
app.use(express.static(path.join(__dirname, 'client/build')));

const users = [
  {id: 4, candidatesId: [24, 51, 76]}, 
  {id: 79, candidatesId: [87, 149, 563]}
];

const candidates = [
    {
    id:51, userId: 4, email: "lalou.zacharie@oostaoo.com", nom: 'Brown', prenom: 'James'
    },
    {
    id:24, userId: 4, email: 'hamdoun.ismael@oostaoo.com', nom: 'Maz', prenom: 'Isma'
    },
    {
    id:76, userId: 4, email: 'famady@oostaoo.com', nom: 'Trankillouche', prenom: "Famadouche"
    }
]

app.get('/candidates/:userId', async (req, res) => {
  const userId = req.params.userId;
  let userCandidates = candidates.filter(c=>c.userId == userId);
  res.send(JSON.stringify(userCandidates));
})


