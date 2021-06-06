const redis = require('redis');
const client = redis.createClient();
const processContents = require('./parseReq');

const onCacheById = (id, func, content) => {
  func = func.bind(client);
  return new Promise((res, rej) => {
    // SET key:value
    if (content) {
      func(id, content, (err, reply) => {
        if (err) rej(err);
        client.expire(id, 172800);
        res(reply);
      });
    }
    // GET or EXISTS
    func(id, (err, reply) => {
      if (err) rej(err);
      res(reply);
    });
  })
    .catch(err => console.log(err));
};

const newBin = async (id) => await client.set(id, JSON.stringify([]));

const addRequest = async (id, req) => {
  const value = await onCacheById(id, client.get);
  const parsed = JSON.parse(value);
  if (parsed.length >= 20) parsed.splice(0, 1);
  return onCacheById(id, client.set, JSON.stringify([...parsed, processContents(req)]));
};

const getCacheById = async(id) => await onCacheById(id, client.get);

const binExists = async(id) => await onCacheById(id, client.exists);

module.exports = {
  addRequest,
  getCacheById,
  binExists,
  newBin,
};