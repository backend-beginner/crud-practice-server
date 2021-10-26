const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
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
    // console.log('Ping Ping Ping');
    const database = client.db("topClients");
    const commentsCollection = database.collection("comments");

    //GET API
    app.get("/comments", async (req, res) => {
      const cursor = commentsCollection.find({});
      const comments = await cursor.toArray();
      res.send(comments);
    });
    
    //POST API
    app.post("/comments", async (req, res) => {
      const comment = req.body;
      // console.log("Ding Ding Ding", comment);
      const result = await commentsCollection.insertOne(comment);
      console.log(result);
      res.json(result);
    });
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
