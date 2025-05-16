/********************************************************************************
* WEB422 – Assignment 1
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
* Name: Pranjal Surjan Student ID: 161709225 Date: May 16, 2025
*
* Published URL: https://web-422-a1-wine.vercel.app/
*
********************************************************************************/

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
         res.status(201).send(listing);
    }catch(err){
        res.status(400).send({message: err});
    }
});

app.get("/api/listings", async (req, res)=>{
    const{ page, perPage, name} = req.query;
    try{

        const listing = await db.getAllListings(Number(page), Number(perPage), name);
         res.status(200).send(listing);
    }catch(err){
        res.status(400).send({message: err});
    }
});

//working dont touch
app.get("/api/listings/:id", async (req, res) => {
    try {
        const listing = await db.getListingById(req.params.id);
        if (!listing) {
            return res.status(404).send({ message: "Listing not found" });
        }
         res.status(200).send(listing);
    } catch (err) {
        res.status(400).send({message: err});
    }
});


app.put("/api/listings/:id", async (req, res) => {
    try {
        const result = await db.updateListingById(req.body, req.params.id);
        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: "Listing not found or no changes made" });
        }
        res.status(201).send({ message: "Listing updated successfully" });
    } catch (err) {
        res.status(400).send({ message: "Failed to update listing", error: err.message });
    }
});

app.delete("/api/listings/:id", async (req, res) => {
    try {
        const result = await db.deleteListingById(req.params.id);
        if (result.deletedCount === 0) {
            return  res.status(204).send({ message: "Listing not found" });
        }
        res.status(200).send({ message: "Listing deleted successfully" }); 
    } catch (err) {
        res.status(400).send({ message: "Failed to delete listing", error: err.message });
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