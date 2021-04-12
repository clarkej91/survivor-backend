// const express = require('express');
// const app = require('express')();
// const http = require('http').Server(app);
// const io = require('socket.io')(http, {
//   cors: {
//     origin: '*',
//   }
// });
//
// io.on('connection', socket => {
//     console.log('User has connected.')
//     socket.on('disconnect', () => {
//         console.log("User has disconnected.")
//     })
// })

const { Socket } = require("../utils/socket");

const saySomething = (req, res, next) => {
    res.status(200).json({
        body: 'Hello from the server!'
    });
};

const getAll = (req, res, client) => {
  client.query('SELECT * FROM public.players ORDER BY id ASC;').then(data => {
    if(data.rows.length){
      res.json(data.rows);
      Socket.emit("FromAPI", { hello: 'from api world' });
    } else {
      res.json({dataExists: 'false'})
    }
  })
  .catch(err => res.status(400).json({dbError: 'db error'}));
};

// app.get('/', (req,res) => {
//   client.query('SELECT * FROM public.players ORDER BY id ASC;').then(data => {
//     if(data.rows.length){
//       res.json(data.rows);
//       io.sockets.emit("FromAPI", data.rows);
//     } else {
//       res.json({dataExists: 'false'})
//     }
//   })
//   .catch(err => res.status(400).json({dbError: 'db error'}));
// })

module.exports = {
  saySomething,
  getAll
};
