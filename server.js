//Requirements
require('dotenv').config();
const express = require("express");
const app = express();
const cors = require("cors");
const ListingsDB = require("./modules/listingsDB.js");
const db = new ListingsDB();

//Port
const HTTP_PORT = process.env.PORT || 8080;

//Middleware
app.use(express.json());
app.use(cors());

//Routes
app.get("/", (req,res)=>{
    res.send({message: "API Listening"});
});

app.post("/api/listings", async(req,res)=>{
    try{
        const listing = await db.addNewListing(req.body);
        res.send(listing);
    }catch(err){
        res.status(404).send({message: err});
    }
});

app.get("/api/listings", async (req, res)=>{
    const{ page, perPage, name} = req.query;
    try{

        const listing = await db.getAllListings(Number(page), Number(perPage), name);
        res.send(listing);
    }catch(err){
        res.status(404).send({message: err});
    }
});

//working dont touch
app.get("/api/listings/:id", async (req, res) => {
    try {
        const listing = await db.getListingById(req.params.id);
        if (!listing) {
            return res.status(404).json({ message: "Listing not found" });
        }
        res.send(listing);
    } catch (err) {
        res.status(404).send({message: err});
    }
});


app.put("/api/listings/:id", async (req, res) => {
    try {
        const result = await db.updateListingById(req.body, req.params.id);
        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: "Listing not found or no changes made" });
        }
        res.send({ message: "Listing updated successfully" });
    } catch (err) {
        res.status(500).json({ message: "Failed to update listing", error: err.message });
    }
});

app.delete("/api/listings/:id", async (req, res) => {
    try {
        const result = await db.deleteListingById(req.params.id);
        if (result.deletedCount === 0) {
            return res.send({ message: "Listing not found" });
        }
        res.status(204).send(); 
    } catch (err) {
        res.status(500).json({ message: "Failed to delete listing", error: err.message });
    }
});


//Connection and Initialization
db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
    app.listen(HTTP_PORT, ()=>{
        console.log(`server listening on: ${HTTP_PORT}`);
    });
}).catch((err)=>{
    console.log(err);
});