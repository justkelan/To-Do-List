import express from "express";
import{PORT, MONGODBURL } from './config.js'
import { MongoClient, ServerApiVersion }from "mongodb"
const app = express()



app.use(express.json())

const client = new MongoClient(MONGODBURL,  {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
}
);

const ToDoListDB = client.db("ToDoList")
const myTasks = ToDoListDB.collection("List")

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})

app.get('/', (req, res) => {
    return res.status(200).send("<h1>Hello there, how are you?!</h1>")
})

app.get('/shop', (req, res) => {
    // route show all books
    myTasks.find().toArray()
        .then(response => {
            // console.log(response)
            res.status(200).send(response)
        })
        .catch(err => console.log(err))
    // return res.status(200).send("<a href='/'> Home</a>")
})

app.get('/shop/:id', (req, res) => {
    // route show a specific book
    const data = req.params

    const filter = {
        "_id": new ObjectId(data.id)
    }

    myTasks.findOne(filter)
        .then(response => {
            // console.log(response)
            res.status(200).send(response)
        })
        .catch(err => console.log(err))
    // return res.status(200).send(`<a href='/'> Book: ${data.id}</a>`)
})

app.post('/savetask', (req, res) => {
    // Route adds a new task
    const data = req.body
    if (!data.task)
        return res.status(400).send("No task found.")
    if (data.task.length>160)
         return res.status(400).send("word limit exceed.")
    if (!data.availibility)
        return res.status(400).send("Enter public or private.")

    if (!data.date)
     return res.status(400).send("No date found.")
     
     if (!data.status)
     return res.status(400).send("completed or to be completed.")
    myTasks.insertOne(data)
    .then(response=>{
        return res.status(201).send(JSON.stringify(response))
    })
    .catch(err=>console.log(err))
})

app.delete('/admin/remove/:id', (req, res) => {
    const data = req.params

    const filter = {
        "_id": new ObjectId(data.id)
    }

    myTasks.deleteOne(filter)
        .then(response => {
            // console.log(response)
            return res.status(200).send(response)
        })
        .catch(err => console.log(err))
})

app.put('/admin/update/:id/', (req, res) => {
    const data = req.params
    const docData = req.body
    
    const filter = {
        "_id": new ObjectId(data.id)
    }

    const updDoc = {
        $set: {
           ...docData //docData.price, docData.cover
        }
    }

    myTasks.updateOne(filter, updDoc)
    .then(response=>{
        res.status(200).send(response)
    })
    .catch(err=>console.log(err))
})