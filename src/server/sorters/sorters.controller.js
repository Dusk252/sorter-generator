/* const SorterModels = require('./models.ts');
const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient */

/* class SorterController {
    getAllSorters() {
        MongoClient.connect('mongodb://localhost:27017/', (err, client) => {
            console.log("Connected successfully to server")
            client.db('sorterGenerator').collection('sorters').find().toArray((err, items) => {console.log(items);});
            client.close()
        });
    }
} */

const express = require('express');
const router = express.Router();
const sortersService = require('./sorters.service');

// routes
router.post('/authenticate', authenticate);     // public route
router.get('/', authorize(Role.Admin), getAll); // admin only
router.get('/:id', authorize(), getById);       // all authenticated users
module.exports = router;

