"use strict";

const express = require('express');
const app = express();
const morgan = require('morgan');
const cache = require('./lib/cache');
const PORT = 8080;
const newId = require('./lib/randId');

app.enable('trust proxy');

app.set('view engine', 'pug');

app.use(morgan("common"));
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded());

app.get('/', (_, res) => {
  res.render('home');
});

app.get('/r/:binId', async (req, res) => {
  const binId = req.params.binId;
  const binExists = await cache.binExists(binId);

  if (req.query.hasOwnProperty('inspect') && binExists) {
    // TODO: if bin is empty render informational page
    // TODO: if bin has requests render request information
    const info = await cache.getCacheById(binId);
    res.render('requests', {
      requestInfo: JSON.parse(info),
      path: req.path,
      host: req.host
    });
  } else if (binExists) {
    await cache.addRequest(binId, req);
    res.status(200).send(`ip:${req.ip}`);
  } else {
    res.status(404).send('Not found');
  }
});

app.post('/new', async (_, res) => {
  const binId = newId(8);
  cache.newBin(binId);
  res.redirect(`/r/${binId}?inspect`);
});

app.post('/r/:binId', async (req, res) => {
  const binId = req.params.binId;
  const binExists = await cache.binExists(binId);

  if (binExists) {
    await cache.addRequest(binId, req);
    res.status(200).send(`ip:${req.ip}`);
  } else {
    res.status(404).send('Not found');
  }
});

app.use((err, _req, res, _next) => {
  console.log(err);
  res.status(404).send(err.message);
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});