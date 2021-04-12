const controllers = require('./../controllers/controllers');
const { Client } = require('pg');
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const cors = require('cors');
var format = require('pg-format');
const app = require('express')();
// const http = require('http').Server(app);
// const io = require('socket.io')(http, {
//   cors: {
//     origin: '*',
//   }
// });

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
//
// io.on('connection', socket => {
//     console.log('User has connected.')
//     socket.on('disconnect', () => {
//         console.log("User has disconnected.")
//     })
// })

router.get('/say-something', controllers.saySomething);

router.get('/get-all', (req, res) => controllers.getAll(req, res, client));

module.exports = router;
