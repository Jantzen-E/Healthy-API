const express = require('express');
const bodyParser = require('body-parser');
const DAL = require('./dataAccessLayer');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const app = express();
const port = 3000; 
const cors = require('cors');
//add our data access layer file
app.use(bodyParser.json());
app.use(cors());
DAL.Connect();

// Endpoints
app.get('/api/items', async(req, res) => {
    // const options = {};
    const result = await DAL.Find();
    
    const query = req.query;
    
    if(query['filterBy']) {
        options['filterBy'] = query['filterBy'];
    }

    if(query['filterByValue']) {
        options['filterByValue'] = query['filterByValue'];
    }

    if(query['orderBy']) {
        options['orderBy'] = query['orderBy'];
    }

    if(query['orderByValue']) {
        options['orderByValue'] = query['orderByValue'];
    }

    if (result) {
        res.sendStatus(200).send('The resources have been successfully fetched')
    }
    else {
        res.sendStatus(400).send('items not found');
    }
});

app.get('/api/items:id', async(req, res) => {
    const id = req.params.id;

    const item = {
        _id: ObjectId(id)
    };

    const result = await DAL.Find(item);

    if (result) {
        res.sendStatus(200).send('The resource has been successfully fetched');
    }
    else {
        res.sendStatus(400).send('No item with ID: ' + id + ' found!');
    }
});

app.delete('/api/items/:id', async(req, res) => {
    const id = req.params.id;
    const item = {
        _id: ObjectId(id)
    };
    const result = await DAL.Remove(item);

    if (result) {
        res.sendStatus(200).send('item was successfully deleted');
    }
    else {
        res.sendStatus(400).send('item was not successfully deleted');
    }
});

app.put('/api/items/:id', async(req, res) => {
    const id = req.params.id;
    const item = {
        _id: ObjectId(id)
    };
    const newItem = req.body;
    const updatedItem = { $set: newItem};
    const result = await DAL.Update(item, updatedItem);
    
    if (result) {
        res.sendStatus(200).send('item was successfully updated');
    }
    else {
        res.sendStatus(400).send('item was not successfully updated');
    }
});

app.post('/api/items', async(req, res) => {
    const item = req.body;

    if (!body.imgUrl) {
        res.sendStatus(400).send('image URL field is missing')
        return;
    }

    if (!body.name) {
        res.sendStatus(400).send('name of item is missing')
        return;
    }

    if (!body.benefits) {
        res.sendStatus(400).send('benefits field is missing')
        return;
    }

    if (!body.uses) {
        res.sendStatus(400).send('uses field is missing')
        return;
    }

    if (!body.sideEffects) {
        res.sendStatus(400).send('side effects field is missing')
        return;
    }

    //validate field exists
    const cleanData = {
        imgUrl: item.imgUrl,
        name: item.name,
        benefits: item.benefits,
        uses: item.uses,
        sideEffects: item.sideEffects
    };

    const result = await DAL.Insert(item);
    res.sendStatus(201).send('item created successfully');
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