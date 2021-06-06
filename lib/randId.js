const CHARACTERS = 'abcdefghijklmnopqrstuvwxyz0123456789';

function generateId(length) {
  id = '';
  for (let count = 0; count < length; count++) {
    id += CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
  }
  return id;
}

module.exports = generateId;