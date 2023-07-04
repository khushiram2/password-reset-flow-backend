import { client } from "./createConnection.js"
import {ObjectId} from "mongodb"
import bcrypt from "bcrypt"
export async function insertNewUser(name, email, password) {
    return await client.db("user2").collection("users").insertOne({ name: name, email: email, password: password })
}

export async function checkIfEmailAlreadyExists(email) {
    const allEmails = await client.db("user2").collection("users").find({ email: email }).toArray()
    if (allEmails.length!==0) {
        return true
    } else {
        return false
    }

} 

export async function checkIfPasswordMatch(email,password){
    const user=await client.db("user2").collection("users").findOne({ email: email })
    const pass= await bcrypt.compare(password,user.password)
    return {id:user._id,pass: pass}
}

export async function editUserById(id,payload){
    const user= await client.db("user2").collection("users").updateOne({ _id: new ObjectId(id)},{$set:{token:payload}})
}

export async function getUserById(id){
    const user = await client.db("user2").collection("users").findOne({ _id: new ObjectId(id)})
    return user
}

export async function getUserByEmail(email){
    const user = await client.db("user2").collection("users").findOne({email:email})
    return user
}

export async function enterPasswordVerifyToken(id,payload){
    const user= await client.db("user2").collection("users").updateOne({ _id: new ObjectId(id)},{$set:{passwordVerifyToken:payload}})   
}

export async function deleteTokenAfterVerification(id){
    await client.db("user2").collection("users").updateOne({_id:new ObjectId(id)},{$unset:{passwordVerifyToken:""}})
}

export async function setnewpassword(id,password){
    await client.db("user2").collection("users").updateOne({_id:new ObjectId(id)},{$set:{password:password}})
}