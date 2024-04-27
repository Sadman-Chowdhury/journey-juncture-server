const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.scfrsgh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    const touristSpotCollection = client.db('touristSpotDB').collection('touristSpot')
    const countryCollection = client.db('touristSpotDB').collection('country')
    const userCollection = client.db('touristSpotDB').collection('user')


    app.get('/touristSpot', async(req,res)=>{
        const cursor = touristSpotCollection.find()
        const result = await cursor.toArray()
        res.send(result)
    })

    app.get('/touristSpot/:id', async(req,res)=>{
        const id = req.params.id
        const query = {_id: new ObjectId(id)}
        const result = await touristSpotCollection.findOne(query)
        res.send(result)
    })

    app.get('/touristSpot/:id', async(req,res)=>{
        const id = req.params.id
        const query = {_id: new ObjectId(id)}
        const result = await touristSpotCollection.findOne(query)
        res.send(result)
    })


    app.post('/touristSpot', async (req, res)=>{
        const newSpot = req.body
        console.log(newSpot)
        const result = await touristSpotCollection.insertOne(newSpot);
        res.send(result)
    })

    app.post('/country', async (req, res)=>{
        const newCountry = req.body
        console.log(newCountry)
        const result = await countryCollection.insertOne(newCountry);
        res.send(result) 
    })

    app.put('/touristSpot/:id', async(req,res)=>{
        const id = req.params.id
        const updatedSpot = req.body
        console.log(id, updatedSpot)
        const filter = {_id: new ObjectId(id)}
        const options = {upsert: true}
        const spot = {
            $set: {
                touristSpotName: updatedSpot.touristSpotName,
                countryName: updatedSpot.countryName, 
                location: updatedSpot.location,
                shortDescription: updatedSpot.shortDescription, 
                averageCost: updatedSpot.averageCost,
                seasonality: updatedSpot.seasonality,
                travelTime: updatedSpot.travelTime,
                totalVisitorPerYear: updatedSpot.totalVisitorPerYear,
                photo: updatedSpot.photo
            }
        }

        const result = await touristSpotCollection.updateOne(filter, spot, options)
        res.send(result)

    })

    app.delete('/touristSpot/:id', async(req,res)=>{
        const id = req.params.id
        console.log('Delete from database', id)
        const query = {_id: new ObjectId(id)}
        const result = await touristSpotCollection.deleteOne(query)
        res.send(result)
    })



    // user
    app.post('/user', async (req, res)=>{
        const user = req.body
        console.log(user)
        const result = await userCollection.insertOne(user);
        res.send(result)
    })

  




    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res)=>{
    res.send('journey juncture server is running')
})


app.listen(port, ()=>{
    console.log(`journey juncture server is running on post: ${port}`)
})