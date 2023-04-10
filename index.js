const express = require('express')
const app = express()
const port = process.env.PORT || 5000 ;
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');



// middleware
app.use(cors())
app.use(express.json())

// database Connected
// userName = studentCrud
// password = Z4LYKlNkpwfYx0F4
const uri = "mongodb+srv://studentCrud:Z4LYKlNkpwfYx0F4@cluster0.rz3ftkv.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
    try{
        const studentDB = client.db('studentDB');
        const students = studentDB.collection('students');


        // add a student to DB 
        app.post('/student', async (req, res)=>{
            const student = req.body;
            const result = await students.insertOne(student)
            res.send(result)
        })

        // get all student from DB
        app.get('/student', async(req, res)=>{
            const query = {};
            const allStudent = await students.find(query).toArray()
            res.send(allStudent)
        })

        // get a single student 
        app.get('/student/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const singleStudent = await students.findOne(query)
            res.send(singleStudent)

        })

        // delete a student from DB
        app.delete('/student/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};
            const result = await students.deleteOne(query)
            res.send(result)
        })

        // update a student 
        app.patch('/student/:id', async(req, res)=>{
            const id = req.params.id;
            const filter = {_id: new ObjectId(id)}
            const updateDoc = req.body;
            const options = {upsert: true}
            const updateStudent = {
                $set: {
                  name: updateDoc.name,
                  address: updateDoc.address
                },
              };
            const result = await students.updateOne(filter, updateStudent, options)
            res.send(result)
        })

    } 
    finally{

    }
}

run()

// main route 
app.get('/', (req, res) => {
  res.send('Hello World!')
})
// listening app on selected port 
app.listen(port, () => {
  console.log(`Student CRUD server listening on port ${port}`)
})