const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vfcqc.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const bikeCollection = client.db("inventory").collection("bikes");
        app.get('/bikes', async (req, res) => {
            const query = {};
            const cursor = bikeCollection.find(query);
            const bike = await cursor.toArray();
            res.send(bike);
        })


        app.get('/bikes/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const bike = await bikeCollection.findOne(query);
            res.send(bike);
        })

        app.post('/bikes', async (req, res) => {
            const newBike = req.body;
            const result = await bikeCollection.insertOne(newBike);
            res.send(result);
        })

        app.delete('/bikes/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await bikeCollection.deleteOne(query);
            res.send(result);
        })

        app.get('/item', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const cursor = bikeCollection.find(query);
            const items = await cursor.toArray();
            res.send(items);
        })
    }
    finally {

    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Running Inventory Server');
})

app.listen(port, () => {
    console.log('Listeing to port', port);
})


