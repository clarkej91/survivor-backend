const { Client } = require('pg');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
var format = require('pg-format');
const app = require('express')();
const http = require('http').Server(app);
const socketIO = require('socket.io')(http, {
  cors: {
    origin: '*',
  }
});

const { io } = require("./utils/socket");
io.attach(socketIO);

require('dotenv').config()

const port = process.env.PORT || 5000;

const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: {
  rejectUnauthorized: false
}
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cors());

client.connect();

socketIO.on('connection', function(socket) {

    console.log('Client connected.');
    // socket.emit('news', { hello: 'world' });
    // Disconnect listener
    socketIO.on('disconnect', function() {
        console.log('Client disconnected.');
    });
});

app.use(cors());

// // Require Route
// const api = require('./routes/routes');
// // Configure app to use route
// app.use('/api/v1/', api);
//
// // This middleware informs the express application to serve our compiled React files
// if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
//     app.use(express.static(path.join(__dirname, 'client/build')));
//
//     app.get('*', function (req, res) {
//         res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
//     });
// };
//
// // Catch any bad requests
// app.get('*', (req, res) => {
//     res.status(200).json({
//         msg: 'Catch All'
//     });
// });

app.get('/getData', (req,res) => {
  client.query('SELECT * FROM public.players ORDER BY id ASC;').then(data => {
    if(data.rows.length){
      res.json(data.rows);
      socketIO.sockets.emit("FromAPI", data.rows);
    } else {
      res.json({dataExists: 'false'})
    }
  })
  .catch(err => res.status(400).json({dbError: 'db error'}));
})
//
// app.put('/getPlayer', (req,res) => {
//   var myArray = req.body.name
//   var sql = format("SELECT * FROM public.players WHERE name IN (%L)", myArray);
//   client
//     .query(sql)
//     .then(data => {
//       if(data.rows.length){
//         res.json(data.rows);
//         io.sockets.emit("FromgetPlayerAPI", data.rows);
//       } else {
//         res.json({dataExists: 'false'})
//       }
//     })
//     .catch(err => res.status(400).json({dbError: 'db error'}));
//   })
//
// app.put('/updateCount', (req, res) => {
//   console.log(req.body);
//   const { id, likeness } = req.body
//   client.query(`UPDATE public.players SET likeness =${likeness} WHERE id = ${id};`).then(data => {
//     res.json({data: 'updated'});
//   })
//   .catch(err => res.status(400).json({dbError: 'db error'}));
// })
//
// app.put('/updateStrength', (req, res) => {
//   console.log(req.body);
//   const { id, strength } = req.body
//   client.query(`UPDATE public.players SET strength =${strength} WHERE id = ${id};`).then(data => {
//     res.json({data: 'updated'});
//   })
//   .catch(err => res.status(400).json({dbError: 'db error'}));
// })
//
// app.put('/updateWit', (req, res) => {
//   console.log(req.body);
//   const { id, wit } = req.body
//   client.query(`UPDATE public.players SET wit =${wit} WHERE id = ${id};`).then(data => {
//     res.json({data: 'updated'});
//   })
//   .catch(err => res.status(400).json({dbError: 'db error'}));
// })
//
// app.put('/updateTribe', (req, res) => {
//   var myArray = req.body.id
//   var tribe = req.body.tribe
//   var sql = format("UPDATE public.players SET tribe = %L WHERE id IN (%L)", tribe, myArray);
//   client
//     .query(sql)
//     .then(data => {
//       res.json({data: 'updated'});
//       console.log(data.rows)
//     })
//     .catch(e => {
//       console.error(e.stack)
//     })
// })


http.listen(port, () => console.log(`BACK_END_SERVICE_PORT: ${port}`));
