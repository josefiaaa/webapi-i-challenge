// implement your API here
const express = require('express');
const db = require('./data/db.js');

const server = express();

server.get('/', (req,res) => {
    res.send("IT'S WORKING!!!")
});

server.use(express.json());

// GET ALL USERS
server.get('/api/users', (req, res) => {
    db
    .find()
    .then(db => {
        res.status(200).json(db);
    })
    .catch(err => {
        res.status(500).json({ error: "The users information could not be retrieved." });
    })
});

// ADD A USER
server.post('/api/users', (req, res) => {
    const userInfo = req.body;
    !userInfo.name || !userInfo.bio
    ? res
        .status(400).json({ errorMessage: "Please provide name and bio for the user." })
    : db
        .insert(userInfo)
        .then( user => {
            res.status(201).json(user);
    })
        .catch( err => {
            res.status(500).json({ error: "There was an error while saving the user to the database" })
    })
})

// GET A USER BY ID
server.get('/api/users/:id', (req, res) => {
    const id = req.params.id;
    db
    .findById(id)
    .then(user => {
        if(user.length === 0) {
            res.status(404).json({ message: "The user you're looking for does not exist." });
        } else {
            res.status(200).json(user);
        }
    })
    .catch(err => {
        res.status(500).json({ error: "This user's information could not be retrieved. Please try again in a moment." })
    });
});

// DELETE A USER
server.delete('/api/users/:id', (req, res) => {
    const userID = req.params.id;
    db.remove(userID)
    .then(deleted => {
        res.status(204).end()
    })
    .catch(err => {
        res.status(500).json({ error: "User could not be deleted" })
    })
})

// EDIT A USER
server.put('/api/users/:id', (req, res) => {
    const id = req.params.id;
    const changes = req.body;

    !changes.name || ! changes.bio 
    ? res 
        .status(400).json({ errorMessage: "Please provide name and bio for the user." })
    : db
        .update(id, changes)
        .then(num => {
            if(num === 0){
                res.status(404).json({ message: "The user with the specified ID does not exist." })
            }
            db
                .findById(id)
                .then(user => {
                    if(user.length === 0){
                        res.status(404).json({ message: "The user with the specified ID could not be located." })
                    } else {
                        res.status(200).json(user)
                    }
                })
        })
        .catch(err => {
            res.status(500).json({ message: "An error occured while attempting to locate the user."})
        })
})

server.listen(5000, () => {
    console.log('\n*** API running on port 5k***\n');
});