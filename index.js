import express from "express"
import cors from "cors"
import { MongoClient, ObjectId } from 'mongodb'
import jwt from "jsonwebtoken"
import * as dotenv from "dotenv"
const app = express()
dotenv.config()
app.use(express.json())
app.use(cors())
const client = new MongoClient(process.env.mongo_key)
await client.connect()
console.log("mongo connected")
app.post("/signup", async function (request, response) {
    const data = request.body
    const sentData = await client.db("registration").collection("signup").insertOne(data)
    if (sentData) {
        response.send({ message: "success" })
    } else {
        response.send({ message: "error" })
    }
})

app.post("/login", async function (request, response) {
    let { user_email, password } = request.body
    const userData = await client.db("registration").collection("signup").findOne({ username: user_email })
    const emailData = await client.db("registration").collection("signup").findOne({ email: user_email })

    if ((userData && userData.password === password)) {
        const token = jwt.sign({ _id: new ObjectId(userData._id) }, process.env.key)
        response.send({ message: "success", token: token, data: userData })
    } else if (emailData && emailData.password === password) {

        const token = jwt.sign({ _id: new ObjectId(emailData._id) }, process.env.key)
        response.send({ message: "success", token: token, data: emailData })

    } else {
        response.send({ message: "fail" })
    }

})

app.listen(4000, () => console.log('connected'))