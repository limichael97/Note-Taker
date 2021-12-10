const express = require('express');
const fs = require('fs');
const path = require('path');
const { stringify } = require('querystring');
const db = require('./db/db.json');

const PORT = process.env.PORT || 3002;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

function createNewNote(body, notesArray) {
  const note = body;
  notesArray.notes.push(note);
  fs.writeFileSync(
    path.join(__dirname, './db/db.json'),
    JSON.stringify( notesArray)
  );
  return note;
}

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/api/notes', (req, res) => {
  let results = db.notes;
  res.json(results);
});

app.delete('/api/notes/:id', (req, res) => {
  var id = req.params.id 
  console.log(id)
  let results = db;
  for (i = 0; i<results.notes.length; i++) {
    if (results.notes[i].id == id ) {
      results.notes.splice(i, 1)
      fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify( results)
      );
    }
  }
})

app.post('/api/notes', (req, res) => {
  // set id based on what the next index of the array will be
  req.body.id = db.notes.length.toString();
  const note = createNewNote(req.body, db);
  res.json(note);
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});
  