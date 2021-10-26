const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const { ObjectID } = require("bson");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

//Username : clients
//User pass : Z0qPphDNtrHZ2PqE

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cvpyv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    // console.log('Successfully Connected');
    const database = client.db("topClients");
    const commentsCollection = database.collection("comments");

    //GET API
    app.get("/comments", async (req, res) => {
      const cursor = commentsCollection.find({});
      const comments = await cursor.toArray();
      res.send(comments);
    });

    //Get single comment in another dynamic route page
    app.get("/comments/:id", async (req, res) => {
      const id = req.params.id;
      console.log('Getting Single Comment', id);
      // const query = { _id: ObjectId(id) };
      // Check above bson declaration
      const query = { _id: ObjectID(id) };
      const comment = await commentsCollection.findOne(query);
      res.json(comment);
    })

    //POST API
    app.post("/comments", async (req, res) => {
      const comment = req.body;
      // console.log("Post Review", comment);
      const result = await commentsCollection.insertOne(comment);
      console.log(result);
      res.json(result);
    });

    //Delete
    app.delete("/comments/:id", async (req, res) => {
      const id = req.params.id;
      console.log('Deleted Comment', id);
      // const query = { _id: ObjectId(id) };
      // Check above bson declaration
      const query = { _id: ObjectID(id) };
      const result = await commentsCollection.deleteOne(query);
      res.json(result);
    })
    
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running CRUD server.");
});

app.listen(port, () => {
  console.log("Welcome to PORT", port);
});
