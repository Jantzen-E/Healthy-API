const express = require('express');
const bodyParser = require('body-parser');


const DAL = require('./dataAccessLayer');
const ObjectId = require('mongodb').ObjectId;
const dotenv = require('dotenv').config();
const app = express();
const port = 3000; 
const cors = require('cors');
//add our data access layer file
app.use(bodyParser.json());
app.use(cors());
DAL.Connect();

// Endpoints
app.get('/api/items', async(req, res) => {
    const results = await DAL.Find();
    // res.send('Hello World');
    res.send(results);
});

app.get('/api/items:id', async(req, res) => {
    const id = req.params.id;

    const item = {
        _id: ObjectId(id)
    };

    const result = await DAL.Find(item);

    if (result) {
        res.send(result);
    }
    else {
        res.send('No item with ID: ' + id + ' found!');
    }
});

app.delete('/api/items/:id', async(req, res) => {
    const id = req.params.id;
    const item = {
        _id: ObjectId(id)
    };
    const result = await DAL.Remove(item);
    res.send(result);
});

app.put('/api/items/:id', async(req, res) => {
    const id = req.params.id;
    const item = {
        _id: ObjectId(id)
    };
    const newItem = req.body;
    const updatedItem = { $set: newItem};
    const result = await DAL.Update(item, updatedItem);
        res.send(result);
});

app.post('/api/items', async(req, res) => {
    const item = req.body;
    const cleanData = {
        imgUrl: item.imgUrl,
        name: item.name,
        benefits: item.benefits,
        uses: item.uses,
        sideEffects: item.sideEffects
    };

    if (cleanData > 0) {
        const result = await DAL.Insert(item);
        res.sendStatus(201);
        res.send('Success');
    }
    else {
        res.send('Fail');
    }
});
    //TODO: validate request (required fields, min length, is number)
    // res.sendStatus(400).send('error message')

    // if validation fails, res.sendStatus(400).send('name field is missing') or category doesn't exist,

    // Sanitize data


    //TODO: insert into database
    //await DAL.insert(cleanData);

    //TODO: send back correct status codes and useful error messages


//TODO: add a put/patch endpoint

//TODO: add a delete endpoint
app.listen(port, () => {
    console.log('Server started!!');

    console.log(`MONGODB_CONNECTION_STRING: ${process.env.MONGODB_CONNECTION_STRING}`);
});