const express = require('express');
const cors = require('cors');
require("dotenv").config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send('assignment submission is pending')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9fxhf2q.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const toyCollections = client.db("assignment-11").collection("toys");

    // 2.1 get a specific data
    app.get('/toys/:id', async(req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id)};
      const result = await toyCollections.findOne(query);
      res.send(result)
    })
    //  2.00 get data according to subCategory and email
    app.get('/toys', async (req, res) => {
      let query = {};
    
      if (req.query.subCategory) {
        query = { subCategory: req.query.subCategory };
      } else if (req.query.sellerEmail) {
        query = { sellerEmail: req.query.sellerEmail };
      }
    
      const result = await toyCollections.find(query).toArray();
      res.send(result);
    });

    // 2. read all data
    app.get("/toys", async(req, res) => {
      const result = await toyCollections.find().toArray();
      res.send(result)
    })

    // 1. create <---> post operation
    app.post('/toys', async(req, res) => {
        const toy = req.body;
      const result = await toyCollections.insertOne(toy);
      res.send(result);
    })

    // 3. update <----> patch (all data)
    app.patch('/toys/:id', async(req, res) => {
      const id = req.params.id;
      const updatedToy = req.body;
      const filter = {_id: new ObjectId(id)};
      const updatedDoc = {
        $set: {
          ...updatedToy
        }
      }
      const result = await toyCollections.updateOne(filter, updatedDoc);
      res.send(result);
    })

    // 4. Delete specific data
    app.delete('/toys/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      result = await toyCollections.deleteOne(query);
      res.send(result);
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log(`assignment code is running on ${port}`)
});