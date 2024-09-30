const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const bcrypt = require("bcrypt");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { request } = require("http");

const dbpath = path.join(__dirname, "details.db");
const app = express();

app.use(express.json());
app.use(cors());

let db = null;
const PORT = 3000;

const initilaizeDbAndServer = async () => {
  try {
    (db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    })),
      app.listen(PORT, () => {
        console.log("Server Started...");
      });
  } catch (e) {
    console.log(`Error db: ${e.message}`);
    process.exit(1);
  }
};




app.get("/data", async (request, response) => {
  const usersQuery = `SELECT * FROM User`
  const detaislQuery = `SELECT * FROM Address`
  const allUsers = await db.all(usersQuery);
  const allAddress = await db.all(detaislQuery);
  response.send(JSON.stringify({allUsers, allAddress}))
})

app.post('/register', async (request, response) => {

  

  try {
    const { name, address } = request.body
    const user = await db.get(`SELECT id FROM User WHERE name = '${name}'`)
    if (user === undefined) {
      await db.run(`INSERT INTO User (name) VALUES ('${name}')`)
      const inserteduser = await db.get(`SELECT id FROM User WHERE name = '${name}'`)
      const {id} = inserteduser
      await db.run(`INSERT INTO Address (address, userId) VALUES ('${address}', ${id})`)
      // response.send(JSON.stringify({message: "Added Address"}))
      response.status(200).json({ message: "Added Address" })
    }
    else {
      await db.run(`INSERT INTO Address (address, userId) VALUES ('${address}', ${user.id})`)
      // response.send(JSON.stringify({message: "Added Another Address"}))
      response.status(200).json({ message: "Added Another Address" })
    }


  } catch (error) {
    response.status(500).json({ message: error.message })
  }


});


initilaizeDbAndServer();