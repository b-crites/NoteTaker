const express = require('express');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 3001;
let notesData = [];
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));
//Get Route
app.get('/api/notes', function (err, res) {
    try {
        notesData = fs.readFileSync('./db/db.json', 'utf8'); 
        notesData = JSON.parse(notesData);

    } catch (err) {
        console.log('\n error (GET):');
        console.log(err);
    }
    res.json(notesData);
});
//Post Route
app.post('/api/notes', function (req, res) {
    try {

        notesData = fs.readFileSync('./db/db.json', 'utf8');
        notesData = JSON.parse(notesData);
        req.body.id = notesData.length;
        notesData.push(req.body);
        notesData = JSON.stringify(notesData);

        fs.writeFile('./db/db.json', notesData, 'utf8', function (err) {
            if (err) throw err;

        });

        res.json(JSON.parse(notesData));

    } catch (err) {
        throw err;
   
    }
});
//Delete
app.delete('/api/notes/:id', function (req, res) {
    try {
        notesData = fs.readFileSync('./db/db.json', 'utf8');

        notesData = JSON.parse(notesData);

        notesData = notesData.filter(function (note) {
            return note.id != req.params.id;
        });
        notesData = JSON.stringify(notesData);

        fs.writeFile('./db/db.json', notesData, 'utf8', function (err) {
            if (err) throw err;
        });

        res.send(JSON.parse(notesData));
    } catch (err) {
        throw err;
      
    }
});

app.get('./notes', function (req, res) {
    return res.sendFile(path.join(__dirname, './db.db.json'));
});

app.get('/notes', function (req, res) {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
});


app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, function () {
    console.log('server is listening to port ' + PORT);
});