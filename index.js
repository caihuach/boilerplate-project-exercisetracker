const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')

const db = require('./db');

require('dotenv').config()
const DB_URI = process.env['DB_URI']


db.init(DB_URI).catch(function (err) {
  console.error(err);
})

app.use(cors())
app.use(express.static('public'))
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// use only one colledtion named log
app.route('/api/users')
  .get(async function (req, res) {
    // query from log and do some selections
    const users = await db.models.Log.find({}).exec();
    res.json(users);
  })
  .post(async function (req, res) {
    const { body } = req;
    const user = await db.models.Log.create(body);
    res.json(user);
  })

app.post('/api/users/:_id/exercises', async function (req, res) {
  const { params, body } = req;
  const { _id } = params;
  const { date } = body;
  // find user first
  const user = await db.models.Log.findById(_id).select().exec();
  if (!user) {
    throw new Error('no user ' + _id);
  }

  body.date = date ? new Date(date) : new Date();
  user.log.push(body);
  await user.save();
  const { username } = user;
  res.json({ _id, username, ...body });
  // res.json(user);
});

app.get('/api/users/:_id/logs', async function (req, res) {
  const { params } = req;
  const { _id } = params;

  const logs = await db.models.Log.findById(_id).exec();

  res.json(logs);
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})

app.use(function (err, req, res, next) {
  res.status(500).send(err);
})