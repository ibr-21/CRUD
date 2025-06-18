const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();

// Replace <password> with your actual Atlas password (URL-encoded if needed)
const uri = "mongodb+srv://devuser:<password>@mydev.c4udgdc.mongodb.net/";

const client = new MongoClient(uri);
const mdb = client.db("test");
const coll = mdb.collection("crud");

app.use(express.json());
app.use(cors());

(async () => {
  try {
    await client.connect();

    // Perform a ping to ensure the connection is actually usable
    await mdb.command({ ping: 1 });

    console.log("✅ Connected to MongoDB Atlas and ping verified");
  } catch (err) {
    console.log("❌ Connection Error: " + err);
  }
})();

// Check Connection to Atlas
// let a = async () => {
//   try {
//     const doc = await coll.find({}).toArray();
//     console.log(doc)
//   } catch (err) {
//     console.error(err);
//   }
// }
// a();

app.get("/", async (req, res) => {
  try {
    const doc = await coll.find({}).toArray();
    // console.log(doc);
    res.json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.post("/create", async (req, res) => {
  const newDoc = {
    // dont use  $ set with insert
    name: req.body.name,
    email: req.body.email,
  };

  try {
    const insertResult = await coll.insertOne(newDoc);
    console.log("📥 Inserted:", insertResult.insertedId);
    res.status(201).json({ message: "Created", id: insertResult.insertedId });
  } catch (err) {
    console.error("❌ Insert failed:", err);
    res.status(500).json({ error: "Insert failed" });
  }
});

app.put("/update/:id", async (req, res) => {
  const id = req.params.id; // from URL like /update/663bd123...

  const myquery = { _id: new ObjectId(id) }; // convert to ObjectId
  const newvalues = {
    $set: {
      name: req.body.name,
      email: req.body.email,
    },
  };

  try {
    const up = await coll.updateOne(myquery, newvalues); // use updateOne instead of updateMany
    if (up.matchedCount > 0) {
      console.log(
        `✅ Update successful: matched ${up.matchedCount}, modified ${up.modifiedCount}`
      );
      res.json({ message: "Update successful" });
    } else {
      console.log("⚠️ No document matched the query.");
      res.status(404).json({ message: "No document found with that ID" });
    }
  } catch (err) {
    console.error("❌ Update error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/student/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const delquery = { _id: new ObjectId(id) };
    const del = await coll.deleteOne(delquery);

    if (del.deletedCount === 1) {
      console.log("✅ Deleted: 1 document");
      res.status(200).json({ message: "Document deleted" });
    } else {
      console.log("⚠️ No document matched that ID");
      res.status(404).json({ message: "No document found with that ID" });
    }
  } catch (err) {
    console.error("❌ Delete error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = 8081;
app.listen(PORT, () => {
  console.log(`Listening On PORT ${PORT}`);
});
